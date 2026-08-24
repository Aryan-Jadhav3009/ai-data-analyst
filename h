warning: in the working copy of 'docker-compose.yml', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/Dockerfile b/Dockerfile[m
[1mindex ee1d636..00e0478 100644[m
[1m--- a/Dockerfile[m
[1m+++ b/Dockerfile[m
[36m@@ -13,6 +13,8 @@[m [mRUN pip install --no-cache-dir --upgrade pip \[m
 [m
 COPY . .[m
 [m
[32m+[m[32mRUN chmod +x entrypoint.sh[m
[32m+[m
 EXPOSE 8000[m
 [m
[31m-CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"][m
\ No newline at end of file[m
[32m+[m[32mCMD ["./entrypoint.sh"][m
\ No newline at end of file[m
[1mdiff --git a/docker-compose.yml b/docker-compose.yml[m
[1mindex dcb1bcb..4234fe1 100644[m
[1m--- a/docker-compose.yml[m
[1m+++ b/docker-compose.yml[m
[36m@@ -1,7 +1,6 @@[m
 services:[m
   postgres:[m
     image: pgvector/pgvector:pg16[m
[31m-    container_name: rag_postgres[m
     environment:[m
       POSTGRES_DB: rag_analyst[m
       POSTGRES_USER: rag_user[m
[36m@@ -10,8 +9,29 @@[m [mservices:[m
       - "5432:5432"[m
     volumes:[m
       - postgres_data:/var/lib/postgresql/data[m
[32m+[m[32m      - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/01-init.sql:ro[m
[32m+[m[32m    healthcheck:[m
[32m+[m[32m      test: ["CMD-SHELL", "pg_isready -U rag_user -d rag_analyst"][m
[32m+[m[32m      interval: 5s[m
[32m+[m[32m      timeout: 5s[m
[32m+[m[32m      retries: 10[m
[32m+[m
[32m+[m[32m  backend:[m
[32m+[m[32m    build:[m
[32m+[m[32m      context: .[m
[32m+[m[32m      dockerfile: Dockerfile[m
[32m+[m[32m    environment:[m
[32m+[m[32m      POSTGRES_DB: rag_analyst[m
[32m+[m[32m      POSTGRES_USER: rag_user[m
[32m+[m[32m      POSTGRES_PASSWORD: rag_password[m
[32m+[m[32m      POSTGRES_HOST: postgres[m
[32m+[m[32m      POSTGRES_PORT: 5432[m
[32m+[m[32m    ports:[m
[32m+[m[32m      - "8000:8000"[m
[32m+[m[32m    depends_on:[m
[32m+[m[32m      postgres:[m
[32m+[m[32m        condition: service_healthy[m
[32m+[m
 [m
 volumes:[m
[31m-  postgres_data:[m
[31m-      [m
[31m-  [m
\ No newline at end of file[m
[32m+[m[32m  postgres_data:[m
\ No newline at end of file[m
[1mdiff --git a/requirements-docker.txt b/requirements-docker.txt[m
[1mindex e1ba9b8..0c2b78f 100644[m
Binary files a/requirements-docker.txt and b/requirements-docker.txt differ
