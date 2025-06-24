export interface ContainerEnv {
  ANTHROPIC_API_KEY: string
}

export interface ContainerOptions {
  apiKey: string
  workspaceId: string
}

export interface ExecResult {
  stdout: string
  stderr: string
  exitCode?: number
}

// Since @cloudflare/containers is a binding interface, we'll create our own wrapper
export class CozyContainer {
  private container: any // This will be the actual container binding
  
  constructor(
    private options: ContainerOptions,
    container?: any
  ) {
    this.container = container
  }
  
  setContainer(container: any) {
    this.container = container
  }

  async initialize(): Promise<void> {
    // Environment variables will be passed during exec calls
    // No initialization needed for now
  }

  private async exec(options: {
    command: string[]
    args?: string[]
    env?: Record<string, string>
  }): Promise<ExecResult> {
    if (!this.container) {
      throw new Error('Container not initialized')
    }
    
    // Combine command and args
    const fullCommand = options.args ? [...options.command, ...options.args] : options.command
    
    // Execute in container
    const result = await this.container.exec(fullCommand, {
      env: options.env || {},
    })
    
    return {
      stdout: result.stdout || '',
      stderr: result.stderr || '',
      exitCode: result.exitCode,
    }
  }

  async executeClaudeCode(prompt: string): Promise<string> {
    try {
      // Execute Claude Code command in the container
      const result = await this.exec({
        command: ['claude', 'code'],
        args: ['--prompt', prompt],
        env: {
          ANTHROPIC_API_KEY: this.options.apiKey,
        },
      })

      return result.stdout
    } catch (error) {
      console.error('Claude Code execution error:', error)
      throw new Error(`Failed to execute Claude Code: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async executeCode(language: string, code: string): Promise<{ stdout: string; stderr: string }> {
    let command: string[]
    
    switch (language) {
      case 'javascript':
      case 'typescript':
        command = ['node', '-e', code]
        break
      case 'python':
        command = ['python3', '-c', code]
        break
      default:
        throw new Error(`Unsupported language: ${language}`)
    }

    try {
      const result = await this.exec({
        command,
        env: {
          ANTHROPIC_API_KEY: this.options.apiKey,
        },
      })

      return {
        stdout: result.stdout,
        stderr: result.stderr,
      }
    } catch (error) {
      console.error('Code execution error:', error)
      throw new Error(`Failed to execute code: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async writeFile(path: string, content: string): Promise<void> {
    await this.exec({
      command: ['sh', '-c', `echo '${content.replace(/'/g, "'\"'\"'")}' > ${path}`],
    })
  }

  async readFile(path: string): Promise<string> {
    const result = await this.exec({
      command: ['cat', path],
    })
    return result.stdout
  }

  async listFiles(directory: string = '.'): Promise<string[]> {
    const result = await this.exec({
      command: ['ls', '-la', directory],
    })
    return result.stdout.split('\n').filter(line => line.trim())
  }

  async createDirectory(path: string): Promise<void> {
    await this.exec({
      command: ['mkdir', '-p', path],
    })
  }

  async installPackage(packageName: string, language: 'node' | 'python' = 'node'): Promise<void> {
    const command = language === 'node' 
      ? ['npm', 'install', packageName]
      : ['pip', 'install', packageName]
    
    await this.exec({ command })
  }
}