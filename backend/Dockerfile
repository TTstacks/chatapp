FROM python:3.12


WORKDIR /django

COPY ./requirements.txt /django/requirements.txt

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONNUNBUFFERED=1


RUN pip install -r requirements.txt



COPY . .