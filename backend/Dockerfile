FROM python:3.11-slim

WORKDIR /app

# Install system dependencies if required
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY app ./app
COPY Mental_Health_Model.pkl .
COPY model_evaluation.json .
COPY "Student Social Media And Mental Health Impact.csv" .

EXPOSE 8000

ENV MODEL_PATH=/app/Mental_Health_Model.pkl
ENV CSV_PATH="/app/Student Social Media And Mental Health Impact.csv"
ENV EVAL_PATH=/app/model_evaluation.json

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
