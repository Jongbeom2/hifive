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

# 개발시 Redis pubsub 사용하기

### Redis 설치하기 (별거 없음)

### Redis 잘 작동하는 지 확인하기

1. redis-server를 실행하여 Redis server를 실행함.
2. redis-cli를 이용하여 Redis client를 실행함 (Redis server 꺼져있으면 실행 안됨).
3. Redis client에서 CHAT이라는 channel을 subscribe 함.
4. Redis client에서 CHAT이라는 channel을 publish하고 "Hello World"라는 메세지를 보냄.
5. CHAT channel을 subscribe하는 client에서 받은 메세지를 확인함.

# Redis를 이용하여 웹 어플리케이션 구현하기

### 클라이언트

- 클라이언트는 redis 사용 여부와 상관없이 코드가 달라지지 않음.
- 클라이언트는 백앤드와 웹소켓 통신함.

### 백앤드

- 백앤드는 redis client가 됨.
- redis client는 redis 패키지를 이용하여 쉽게 구현 가능함.

[redis](https://www.npmjs.com/package/redis)

# AWS Lightsail을 이용하여 배포하고 테스트하기

### 구성

- 서버 인스턴스 2개
- 로드 밸런서 1개
- Redis  서버 인스턴스 1개

### 서버 인스턴스

- pm2를 이용하여 서버 실행
- redis host ip는 redis 서버 내부 ip로 설정edis host ip는 redis 서버 내부 ip로 설정

### 로드 밸런서

- 서버 인스턴스 2개 연결

### Redis 서버

- Redis 설치후 실행Redis 설치후 실행
- bind : redis 서버 private ip / protected-mode : yes / requirepass : ****

### 결과

- 서로 다른 유저가 로드밸런서로 같은 요청을 하였지만, 서로 다른 인스턴스에 연결된 경우에도 pub/sub이 잘 구현됨.
