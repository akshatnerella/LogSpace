#!/usr/bin/env python3
"""
Setup script for LogSpace backend
"""

import os
import subprocess
import sys
from pathlib import Path

def run_command(command, description):
    """Run a shell command and handle errors"""
    print(f"📋 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"❌ Error during {description}:")
        print(f"Command: {command}")
        print(f"Error: {e.stderr}")
        sys.exit(1)

def main():
    print("🚀 Setting up LogSpace Backend")
    print("=" * 40)
    
    # Check if we're in the backend directory
    if not Path("main.py").exists():
        print("❌ Please run this script from the backend directory")
        sys.exit(1)
    
    # Check if .env file exists
    if not Path(".env").exists():
        print("📝 Creating .env file from template...")
        if Path(".env.example").exists():
            run_command("cp .env.example .env", "Copy environment template")
            print("⚠️  Please edit .env file with your actual configuration values")
        else:
            print("❌ .env.example file not found")
            sys.exit(1)
    
    # Install dependencies
    run_command("pip install -r requirements.txt", "Install Python dependencies")
    
    # Initialize Alembic (if not already done)
    if not Path("alembic/versions").exists():
        Path("alembic/versions").mkdir(parents=True, exist_ok=True)
        print("📁 Created Alembic versions directory")
    
    # Generate initial migration
    try:
        run_command("alembic revision --autogenerate -m 'Initial migration'", "Generate initial migration")
    except:
        print("⚠️  Migration generation failed - you may need to configure your database URL first")
    
    print("\n🎉 Setup completed!")
    print("\nNext steps:")
    print("1. Edit .env file with your actual configuration values")
    print("2. Set up your Supabase database")
    print("3. Configure Clerk authentication")
    print("4. Run migrations: alembic upgrade head")
    print("5. Start the server: python main.py")

if __name__ == "__main__":
    main()
