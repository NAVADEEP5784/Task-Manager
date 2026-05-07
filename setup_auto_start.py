#!/usr/bin/env python
"""
Windows Task Scheduler Setup Script
Creates a scheduled task that starts the server on system boot
Run this script as Administrator to set up auto-start
"""

import os
import subprocess
import sys

def setup_task_scheduler():
    """Create a Windows Task Scheduler task for auto-start"""
    
    script_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'start_server.bat'))
    
    # Check if running as admin
    try:
        import ctypes
        is_admin = ctypes.windll.shell.IsUserAnAdmin()
    except:
        is_admin = False
    
    if not is_admin:
        print("ERROR: This script must be run as Administrator!")
        print("Right-click on Command Prompt or PowerShell and select 'Run as administrator'")
        return False
    
    print("Setting up Windows Task Scheduler...")
    print(f"Script path: {script_path}")
    
    # Create task using SchTasks command
    task_name = "TaskManagerServer"
    task_description = "Starts the Task Manager production server on system boot"
    
    # First, delete the task if it already exists
    try:
        subprocess.run(
            f'schtasks /delete /tn "{task_name}" /f',
            shell=True,
            capture_output=True
        )
    except:
        pass
    
    # Create the task
    command = (
        f'schtasks /create /tn "{task_name}" '
        f'/tr "{script_path}" '
        f'/sc onboot /ru SYSTEM /f'
    )
    
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✓ Task created successfully!")
            print(f"  Task name: {task_name}")
            print(f"  Trigger: System boot")
            print(f"  Action: Run {script_path}")
            print("\nThe server will now start automatically when your computer boots.")
            return True
        else:
            print("ERROR: Failed to create task")
            print(result.stderr)
            return False
    except Exception as e:
        print(f"ERROR: {e}")
        return False

def remove_task_scheduler():
    """Remove the scheduled task"""
    
    # Check if running as admin
    try:
        import ctypes
        is_admin = ctypes.windll.shell.IsUserAnAdmin()
    except:
        is_admin = False
    
    if not is_admin:
        print("ERROR: This script must be run as Administrator!")
        return False
    
    task_name = "TaskManagerServer"
    command = f'schtasks /delete /tn "{task_name}" /f'
    
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✓ Task '{task_name}' removed successfully")
            return True
        else:
            print("ERROR: Failed to remove task")
            print(result.stderr)
            return False
    except Exception as e:
        print(f"ERROR: {e}")
        return False

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == '--remove':
        print("Removing Task Scheduler task...")
        remove_task_scheduler()
    else:
        print("Task Manager Server - Task Scheduler Setup")
        print("=" * 50)
        print("\nThis script will create a scheduled task that automatically")
        print("starts the Task Manager server when your computer boots up.")
        print("\nIMPORTANT: This script must be run as Administrator!")
        print("\nTo run as Administrator:")
        print("1. Open Command Prompt or PowerShell as Administrator")
        print("2. Run: python setup_auto_start.py")
        print("\n" + "=" * 50)
        
        input("\nPress Enter to continue (or Ctrl+C to cancel)...")
        
        if setup_task_scheduler():
            print("\n✓ Setup complete!")
        else:
            print("\n✗ Setup failed!")
            sys.exit(1)
