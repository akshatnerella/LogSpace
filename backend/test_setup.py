#!/usr/bin/env python3
"""
Test script to verify LogSpace backend setup
"""

import asyncio
import sys
from pathlib import Path

async def test_database_connection():
    """Test database connection"""
    try:
        from db.session import AsyncSessionLocal, engine
        
        # Test engine creation
        print("📊 Testing database engine...")
        
        # Test session creation
        print("🔌 Testing database session...")
        async with AsyncSessionLocal() as session:
            result = await session.execute("SELECT 1")
            if result.scalar() == 1:
                print("✅ Database connection successful!")
                return True
            else:
                print("❌ Database query failed")
                return False
                
    except Exception as e:
        print(f"❌ Database connection failed: {str(e)}")
        return False

async def test_models():
    """Test model imports"""
    try:
        from api.models import User, Project, Log, Collaborator
        print("✅ Models imported successfully!")
        return True
    except Exception as e:
        print(f"❌ Model import failed: {str(e)}")
        return False

async def test_schemas():
    """Test schema imports"""
    try:
        from api.schemas import (
            UserCreate, ProjectCreate, LogCreate, CollaboratorInvite
        )
        print("✅ Schemas imported successfully!")
        return True
    except Exception as e:
        print(f"❌ Schema import failed: {str(e)}")
        return False

async def test_routes():
    """Test route imports"""
    try:
        from api.routes import auth, projects, logs, collaborators
        print("✅ Routes imported successfully!")
        return True
    except Exception as e:
        print(f"❌ Route import failed: {str(e)}")
        return False

async def test_app():
    """Test FastAPI app creation"""
    try:
        from main import app
        print("✅ FastAPI app created successfully!")
        return True
    except Exception as e:
        print(f"❌ FastAPI app creation failed: {str(e)}")
        return False

async def main():
    """Run all tests"""
    print("🧪 Running LogSpace Backend Tests")
    print("=" * 40)
    
    # Check if we're in the backend directory
    if not Path("main.py").exists():
        print("❌ Please run this script from the backend directory")
        sys.exit(1)
    
    # Check environment file
    if not Path(".env").exists():
        print("⚠️  .env file not found - some tests may fail")
    else:
        print("✅ Environment file found!")
    
    tests = [
        ("Models", test_models),
        ("Schemas", test_schemas),
        ("Routes", test_routes),
        ("FastAPI App", test_app),
        ("Database Connection", test_database_connection),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n🔍 Testing {test_name}...")
        try:
            result = await test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} test crashed: {str(e)}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 40)
    print("📋 Test Results Summary:")
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {status} {test_name}")
        if result:
            passed += 1
    
    print(f"\n🎯 Tests Passed: {passed}/{total}")
    
    if passed == total:
        print("🎉 All tests passed! Backend is ready to run.")
        print("\nNext steps:")
        print("1. Run: python start.py")
        print("2. Visit: http://localhost:8000/docs")
    else:
        print("⚠️  Some tests failed. Please check the configuration.")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
