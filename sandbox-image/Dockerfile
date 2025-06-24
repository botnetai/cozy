# Base image with Node.js 22
FROM node:22-slim

# Install Python 3.12 and essential tools
RUN apt-get update && apt-get install -y \
    software-properties-common \
    curl \
    git \
    build-essential \
    && add-apt-repository ppa:deadsnakes/ppa -y \
    && apt-get update \
    && apt-get install -y \
    python3.12 \
    python3.12-pip \
    python3.12-venv \
    python3.12-dev \
    && rm -rf /var/lib/apt/lists/*

# Set Python 3.12 as default
RUN update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.12 1 \
    && update-alternatives --install /usr/bin/pip3 pip3 /usr/bin/pip3.12 1

# Create app directory
WORKDIR /sandbox

# Install global packages
RUN npm install -g tsx esbuild

# Install Claude Code CLI
RUN npm install -g @anthropic-ai/claude-code-cli

# Install Python Claude Code SDK
RUN pip3 install anthropic claude-code

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

# Install common Python packages including Claude Code dependencies
RUN pip install --no-cache-dir \
    numpy \
    pandas \
    requests \
    anthropic \
    claude-code

# Set up Claude Code workspace
WORKDIR /home/sandboxuser/workspace

# Environment variable for API key (will be injected at runtime)
ENV ANTHROPIC_API_KEY=""

# Entry point
CMD ["/bin/bash"]