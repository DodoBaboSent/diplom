FROM golang:latest

WORKDIR /diplom

COPY ./server/ .

RUN go get
RUN go build

CMD [ "./server" ]
