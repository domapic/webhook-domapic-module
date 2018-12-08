#!/usr/bin/env bash

npm run domapic-webhook start -- --path=${domapic_path} ${service_extra_options}
npm run domapic-webhook logs
