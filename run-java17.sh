#!/usr/bin/env bash
set -euo pipefail

JAVA_17_HOME="${JAVA_17_HOME:-/usr/lib/jvm/java-17-openjdk-amd64}"

if [ ! -x "${JAVA_17_HOME}/bin/java" ]; then
    echo "Java 17 not found at ${JAVA_17_HOME}" >&2
    echo "Set JAVA_17_HOME to your local JDK 17 path and retry." >&2
    exit 1
fi

export JAVA_HOME="${JAVA_17_HOME}"
export PATH="${JAVA_HOME}/bin:${PATH}"

exec mvn spring-boot:run "$@"
