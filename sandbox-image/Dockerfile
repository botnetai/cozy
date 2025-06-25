# Base image with Node.js 22
FROM node:22-slim

# Install Python and essential tools
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    python3-dev \
    curl \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /sandbox

# Install global packages
RUN npm install -g tsx esbuild

# Create a non-root user
RUN useradd -m -s /bin/bash sandboxuser

# Set up workspace directory with proper permissions
RUN mkdir -p /home/sandboxuser/workspace && \
    chown -R sandboxuser:sandboxuser /home/sandboxuser/workspace

# Switch to non-root user
USER sandboxuser

# Set up Python virtual environment
RUN python3 -m venv /home/sandboxuser/venv
ENV PATH="/home/sandboxuser/venv/bin:$PATH"

# Install common Python packages
RUN pip install --no-cache-dir \
    numpy \
    pandas \
    requests

# Set up Claude Code workspace
WORKDIR /home/sandboxuser/workspace

# Environment variable for API key (will be injected at runtime)
ENV ANTHROPIC_API_KEY=""

# Copy server file
COPY --chown=sandboxuser:sandboxuser server.js /home/sandboxuser/

# Expose port
EXPOSE 8080

# Entry point - run the server
CMD ["node", "/home/sandboxuser/server.js"]