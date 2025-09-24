try:
    from celery import shared_task
except Exception:
    def shared_task(fn):  # type: ignore
        return fn

from .models import ImportJob
from .services import process_job

@shared_task
def process_job_task(job_id: int) -> int:
    job = ImportJob.objects.get(id=job_id)
    process_job(job)
    return job.id
