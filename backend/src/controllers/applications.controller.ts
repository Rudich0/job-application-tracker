import { Request, Response, NextFunction } from 'express';
import pool from '../db/pool';
import {
  Application,
  CreateApplicationDto,
  UpdateApplicationDto,
  ListApplicationsQuery,
  PaginatedResponse,
} from '../types';

export const listApplications = async (
  req: Request<Record<string, never>, unknown, unknown, ListApplicationsQuery>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { status, search, page = '1', limit = '20' } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const offset = (pageNum - 1) * limitNum;

    const conditions: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (status) {
      conditions.push(`status = $${idx++}`);
      values.push(status);
    }

    if (search) {
      conditions.push(
        `(company_name ILIKE $${idx} OR job_title ILIKE $${idx})`,
      );
      values.push(`%${search}%`);
      idx++;
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await pool.query<{ count: string }>(
      `SELECT COUNT(*) FROM applications ${where}`,
      values,
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const dataResult = await pool.query<Application>(
      `SELECT * FROM applications ${where} ORDER BY applied_date DESC, created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
      [...values, limitNum, offset],
    );

    const response: PaginatedResponse<Application> = {
      data: dataResult.rows,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
};

export const getApplication = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await pool.query<Application>(
      'SELECT * FROM applications WHERE id = $1',
      [id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const createApplication = async (
  req: Request<Record<string, never>, unknown, CreateApplicationDto>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { company_name, job_title, job_type, status, applied_date, notes } = req.body;

    const result = await pool.query<Application>(
      `INSERT INTO applications (company_name, job_title, job_type, status, applied_date, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [company_name, job_title, job_type, status ?? 'Applied', applied_date, notes ?? null],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const updateApplication = async (
  req: Request<{ id: string }, unknown, UpdateApplicationDto>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const fields = req.body;

    const allowedFields: (keyof UpdateApplicationDto)[] = [
      'company_name', 'job_title', 'job_type', 'status', 'applied_date', 'notes',
    ];

    const setClauses: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    for (const field of allowedFields) {
      if (field in fields) {
        setClauses.push(`${field} = $${idx++}`);
        values.push(fields[field] ?? null);
      }
    }

    if (setClauses.length === 0) {
      res.status(400).json({ error: 'No valid fields to update' });
      return;
    }

    values.push(id);
    const result = await pool.query<Application>(
      `UPDATE applications SET ${setClauses.join(', ')} WHERE id = $${idx} RETURNING *`,
      values,
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const deleteApplication = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await pool.query<Application>(
      'DELETE FROM applications WHERE id = $1 RETURNING id',
      [id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
