import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    if (supabase) {
      const { data: job, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && job) {
        // Fetch similar jobs
        const { data: similar } = await supabase
          .from('jobs')
          .select('id, title, company, location, work_type, is_remote, required_skills, apply_url')
          .neq('id', id)
          .limit(3);

        return NextResponse.json({
          job: {
            ...job,
            applyUrl: job.apply_url,
            matchedSkills: (job.required_skills || []).map((s: string) => ({
              name: s,
              matched: true,
            })),
          },
          similarJobs: similar || [],
        });
      }
    }

    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  } catch (err: unknown) {
    console.error('Error in GET /api/jobs/[id]:', err);
    return NextResponse.json({ error: 'Failed to retrieve job details' }, { status: 500 });
  }
}
