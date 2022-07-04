# Microservice Bootstrapper

A few simple utils that are generally used by all my AWS-based Microservices.

## Installation

### NPM

```
npm install --save-dev @mattwyskiel/bootstrap-microservice
```

### Yarn

```
yarn add --dev @mattwyskiel/bootstrap-microservice
```

## Usage

```
npx bootstrap-microservice [options] [command] / yarn bootstrap-microservice [options] [command]

CLI to add opinionated common boilerplate to SST-generated TypeScript microservices

Options:
  -V, --version          output the version number
  -h, --help             display help for command

Commands:
  boilerplate [options]
  codeformat [options]
  help [command]         display help for command
```

## Commands

### `boilerplate`

```
bootstrap-microservice boilerplate [options]

Options:
  -d, --dir <directory>     directory to output folder "lib/" of boilerplate code files in (relative to current working
                            directory) (default: "./")
  -p --project <directory>  root project directory which contains package.json file (default: "./")
  -h, --help                display help for command
```

This tool adds the following functionality to the `libs/` directory

#### Logger

This library exposes a pre-configured [`winston`](https://github.com/winstonjs/winston) logger with
the following settings:

1. When deployed, outputs logs as JSON, including the timestamp, with a default minimum log level of
   `info` (can be set using the `LOG_LEVEL` environment variable)
2. When running locally (`process.env.IS_LOCAL`), outputs to the console with the following custom
   format:

```
${level.toUpperCase()} - ${message}
${detailIfExists}
```

For example:

```
INFO - Incoming Request
{
  "body": {
    "foo": "bar"
  },
  "headers: {
    "x-foo": "bar"
  }
}
```

And the formatter has logic such that if there is only one field in the `details` object, then it
will just print that.

For example, if the above request details only had the `body`, the log could come across like the
following:

```
INFO - Request Body
{
  "foo": "bar"
}
```

##### Usage

```typescript
import { logger } from '@mattwyskiel/microservice-boilerplate';

logger.info('This is a log!');
```

#### Request Monitoring

This library implements a [`middy`](https://github.com/middyjs/middy) middleware that does the
following:

1. Adds the AWS Request ID to the logs for grouping and searchability.
2. If the code is deployed, logs the API Gateway proxy requests and responses.
3. Intercepts all errors and normalizes them for consistent

##### Usage

```typescript
import { requestMonitoring } from '@mattwyskiel/microservice-boilerplate';
import middy from '@middy/core';

// define handler

export default middy(handler).use(requestMonitoring());
```

#### Amazon API Gateway Helper Types

This library defines some helper types that enable a strongly-typed API Gateway request body.

```typescript
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Handler } from 'aws-lambda';
import { FromSchema } from 'json-schema-to-ts';

export type APIGatewayJSONBodyEvent<S> = Omit<APIGatewayProxyEventV2, 'body'> & {
  body: FromSchema<S>;
};

export type APIGatewayJSONBodyEventHandler<S> = Handler<
  APIGatewayJSONBodyEvent<S>,
  APIGatewayProxyResultV2
>;
```

The library also exposes a helper function that can send a 'success' JSON response:

```typescript
import { json } from '@mattwyskiel/microservice-boilerplate';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

export const handler: APIGatewayProxyHandlerV2 = event => {
  return json({
    message: `Hello, World! Your request was received at ${event.requestContext.time}.`,
  });
};
```

### `codeformat`

```
Usage: bootstrap-microservice codeformat [options]

Options:
  -p --project <directory>  root project directory which contains package.json file (default: "./")
  -h, --help                display help for command
```

This tool installs `eslint` and `prettier` and provides default configs for both, for use in
TypeScript projects.
