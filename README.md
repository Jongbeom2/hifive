# 참고자료

[Redis Tutorial for Beginners 1 - Introduction](https://www.youtube.com/watch?v=64VG179N4no&list=PLS1QulWo1RIYZZxQdap7Sd0ARKFI-XVsd&index=1)

# Pubsub을 구현할 때 Redis가 필요한 이유

Redis는 다양한 기능을 제공함. 여기서는 그 중에서 pubsub 기능만 이용함.

### monolithic instance 환경에서 pubsub을 구현하는 경우

- 아무 문제가 안생김.

### multi instance 환경에서 redis없이 pusbsub을 구현하는 경우

- 문제가 생김.
- 항상 생기진 않고, 서로 다른 client가 각자 다른 instance와 web socket 통신을 할 때 문제가 생김.
- 특정 instance에서 publish를 하면 그 instance를 subscribe하고 있는 client에게만 publish가 됨. 다른 instance에 publish가 안됨. 그래서 실시간 채팅같은 어플리케이션 구현이 안됨

### 두 환경 아키텍처 차이

[Amazon ElastiCache(Redis)를 이용한 채팅 애플리케이션 구성 방법 | Amazon Web Services](https://aws.amazon.com/ko/blogs/korea/how-to-build-a-chat-application-with-amazon-elasticache-for-redis/)

# Redis pubsub 튜토리얼

### Redis 설치하기

윈도우용 redis는 없음. 마이크로 소프트에서 만든 윈도우 redis를 임시로 사용해야함.

[microsoftarchive/redis](https://github.com/microsoftarchive/redis)

### Redis 잘 작동하는 지 확인하기

1. redis-server를 실행하여 Redis server를 실행함.

    ```bash
    // redis-server.exe 파일이 있는 경로에서 다음과 같이 입력
    redis-server
    ```

2. redis-cli를 이용하여 Redis client를 실행함 (Redis server 꺼져있으면 실행 안됨).

3. Redis client에서 CHAT이라는 channel을 subscribe 함.

4. Redis client에서 CHAT이라는 channel을 publish하고 "Hello World"라는 메세지를 보냄.

5. CHAT channel을 subscribe하는 client에서 받은 메세지를 확인함.

# Redis를 이용하여 웹 어플리케이션 구현하기 (Local)
[redis](https://www.npmjs.com/package/redis)

1. 클라이언트 빌드

    ```bash
    yarn && yarn build
    ```

2. 클라이언트 빌드 결과물 서버 build-client 폴더로 이동
3. 서버 .env 파일 생성

    ```bash
    PORT=4200
    REDIS_HOST=
    REDIS_PORT=6379
    ```

4. 서버 실행

    ```bash
    yarn && yarn dev
    ```

# AWS Lightsail을 이용하여 배포하고 테스트하기

1. 구성하기
    - 서버 인스턴스 2개
    - 로드 밸런서 1개 (서버 인스턴스 2개와 연결)
    - Redis  서버 인스턴스 1개
2. Redis 설치, 세팅, 실행
    - Redis 설치
    - redis.conf 파일 다음과 같이 세팅

        ```bash
        bind : redis 서버 private ip
        protected-mode : yes 
        requirepass : ****
        ```

    - Redis 실행

        ```bash
        // redis.conf 반영하여 실행하기 위해서는 다음과 같이 실행
        src/redis-server redis.conf
        ```

3. 백앤드 서버 세팅 및 실행
    - .env 파일은 다음과 같이 작성

        ```bash
        PORT=80
        REDIS_HOST=Redis 서버 내부 ip
        REDIS_PORT=6379
        ```

    - pm2를 이용하여 서버 실행
4. 결과 확인
    - 서로 다른 유저가 로드밸런서로 같은 요청을 하고, 서로 다른 인스턴스에 연결된 경우에도 pub/sub이 잘 구현됨.

# 도커를 이용하여 배포하고 테스트하기 (Local)

1. 레디스 도커 이미지 받아 컨테이너 실행

    [redis](https://hub.docker.com/_/redis)

2. 백앤드 코드 빌드를 위해 빌드 스크립트 작성

    ```bash
    FROM node:12.13.0

    WORKDIR /app

    COPY . .

    RUN yarn install

    ENV PORT=4200
    ENV REDIS_HOST=192.***.***.*** // 호스트ip
    ENV REDIS_PORT=6379

    CMD ["sh","-c","node index.js"]
    ```

    **Redis Client를 도커로 배포하고 실행하는 경우**
    - 도커로 배포한 컨테이너에서는 redis server가 없음. 별도의 환경이기 때문임.
    - 따라서 localhost:6379에 연결이 안됨.
    - 그래서 localhost:6379가 아니라 호스트ip:6379에 연결해야함.

3. 이미지 빌드
4. 이미지로 컨테이너 실행
5. 결과 확인

# 쿠버네티스에 배포하고 테스트하기

1. 클러스터 생성
2. redis 도커 이미지 받기

    ```bash
    docker pull redis
    ```

3. redis 도커 이미지 이름 변경

    ```bash
    docker image tag redis gcr.io/${PROJECT_ID}/redis
    ```

4. redis 도커 이미지 container registry에 push

    ```bash
    docker push gcr.io/${PROJECT_ID}/redis
    ```

5. redis 도커 이미지로 작업 부하 생성
6. 작업 부하로 클러스터 IP 서비스 생성 (6379:6379로 포팅)
7. 백앤드 코드 git pull 하기
8. Dockerfile다음과 같이 작성

    ```bash
    FROM node:12.13.0

    WORKDIR /app

    COPY . .

    RUN yarn install

    ENV PORT=4200
    ENV REDIS_HOST=***.***.***.*** // redis 서비스 클러스터 IP
    ENV REDIS_PORT=6379

    CMD ["sh","-c","node index.js"]
    ```

9. 도커 이미지로 빌드

    ```bash
    docker build -t gcr.io/${PROJECT_ID}/hifive:v1 .
    ```

10. 도커 이미지 container registry에 push

    ```bash
    docker push gcr.io/${PROJECT_ID}/hifive:v1
    ```

11. hifive 도커 이미지로 작업 부하 생성
12. 작업 부하로 외부 부하 분산기 서비스 생성 (80:4200으로 포팅)
13. Redis Pod 1개로 줄이기

    **왜 Redis Pod가 하나여야 하나**
    - Redis Pod가 여러개면, 서버의 Pod가 서로 다른 Redis Pod에 연결될 수 있음.
    - 이 경우 Mongo DB atlas 처럼 Redis의 Replica Set을 관리하는 서비스가 필요함. 직접 구축할 수도 있지만 빡셈.
    - 그래서 과한 부하가 발생하지 않는다면 Redis Pod 1개로 유지하고, 아니라면 서비스를 이용하는게 좋음.
