# test_memory.py
"""
Test script for the in-memory session management system.
"""

import requests
import json
import time

# Test configuration
API_BASE = "http://localhost:8000"
TEST_USER_ID = "test_user_memory_123"

def test_memory_conversation():
    """Test that conversation history is maintained across requests."""
    print("=== Testing Memory Conversation ===\n")
    
    # First message
    print("1. Asking about Python variables...")
    response1 = requests.post(f"{API_BASE}/chat", json={
        "user_id": TEST_USER_ID,
        "user_type": "student",
        "message": "What are Python variables?",
        "student_level": "beginner"
    })
    
    if response1.status_code == 200:
        result1 = response1.json()
        print(f"✅ First response received")
        print(f"Route: {result1.get('route_taken')}")
        print(f"Reply preview: {result1.get('reply', '')[:100]}...")
    else:
        print(f"❌ First request failed: {response1.text}")
        return
    
    print("\n" + "="*50 + "\n")
    
    # Second message (should reference the previous conversation)
    print("2. Following up with a related question...")
    response2 = requests.post(f"{API_BASE}/chat", json={
        "user_id": TEST_USER_ID,
        "user_type": "student", 
        "message": "Can you give me a simple example?",
        "student_level": "beginner"
    })
    
    if response2.status_code == 200:
        result2 = response2.json()
        print(f"✅ Second response received")
        print(f"Route: {result2.get('route_taken')}")
        print(f"Reply preview: {result2.get('reply', '')[:100]}...")
    else:
        print(f"❌ Second request failed: {response2.text}")
        return
    
    print("\n" + "="*50 + "\n")
    
    # Check session info
    print("3. Checking session information...")
    session_response = requests.get(f"{API_BASE}/session/{TEST_USER_ID}")
    
    if session_response.status_code == 200:
        session_info = session_response.json()
        print(f"✅ Session info retrieved")
        print(f"Message count: {session_info.get('message_count', 0)}")
        print(f"Session count: {session_info.get('session_count', 0)}")
        print(f"User type: {session_info.get('user_type')}")
        print(f"Student level: {session_info.get('student_level')}")
    else:
        print(f"❌ Session info failed: {session_response.text}")

def test_memory_stats():
    """Test memory statistics endpoint."""
    print("\n=== Testing Memory Statistics ===\n")
    
    response = requests.get(f"{API_BASE}/memory/stats")
    
    if response.status_code == 200:
        stats = response.json()
        print("✅ Memory stats retrieved:")
        print(f"Active sessions: {stats.get('active_sessions', 0)}")
        print(f"Total messages: {stats.get('total_messages', 0)}")
        print(f"Session timeout: {stats.get('session_timeout', 0)}s")
        print(f"Max messages per session: {stats.get('max_messages_per_session', 0)}")
    else:
        print(f"❌ Memory stats failed: {response.text}")

def test_session_cleanup():
    """Test session cleanup functionality."""
    print("\n=== Testing Session Cleanup ===\n")
    
    # Clear the test session
    response = requests.delete(f"{API_BASE}/session/{TEST_USER_ID}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Session cleared: {result.get('message')}")
    else:
        print(f"❌ Session clear failed: {response.text}")
    
    # Verify session is gone
    check_response = requests.get(f"{API_BASE}/session/{TEST_USER_ID}")
    if check_response.status_code == 404:
        print("✅ Session successfully deleted")
    else:
        print("❌ Session still exists after deletion")

def test_different_users():
    """Test that different users have separate sessions."""
    print("\n=== Testing User Separation ===\n")
    
    user1_id = "user1_test"
    user2_id = "user2_test"
    
    # Send messages from two different users
    response1 = requests.post(f"{API_BASE}/chat", json={
        "user_id": user1_id,
        "user_type": "student",
        "message": "I'm user 1, learning Python",
        "student_level": "beginner"
    })
    
    response2 = requests.post(f"{API_BASE}/chat", json={
        "user_id": user2_id,
        "user_type": "instructor", 
        "message": "I'm user 2, I need help creating a quiz",
        "student_level": "advanced"
    })
    
    if response1.status_code == 200 and response2.status_code == 200:
        print("✅ Both users sent messages successfully")
        
        # Check both sessions exist separately
        session1 = requests.get(f"{API_BASE}/session/{user1_id}")
        session2 = requests.get(f"{API_BASE}/session/{user2_id}")
        
        if session1.status_code == 200 and session2.status_code == 200:
            s1_info = session1.json()
            s2_info = session2.json()
            
            print(f"✅ User 1 session - Type: {s1_info.get('user_type')}, Messages: {s1_info.get('message_count')}")
            print(f"✅ User 2 session - Type: {s2_info.get('user_type')}, Messages: {s2_info.get('message_count')}")
            
            # Cleanup
            requests.delete(f"{API_BASE}/session/{user1_id}")
            requests.delete(f"{API_BASE}/session/{user2_id}")
        else:
            print("❌ Failed to retrieve separate sessions")
    else:
        print("❌ Failed to send messages from different users")

def main():
    """Run all memory tests."""
    print("DirectEd AI Memory System Test")
    print("=" * 40)
    
    try:
        # Test basic conversation memory
        test_memory_conversation()
        
        # Test memory statistics
        test_memory_stats()
        
        # Test user separation
        test_different_users()
        
        # Test cleanup (should be last)
        test_session_cleanup()
        
        print("\n" + "=" * 40)
        print("✅ All memory tests completed!")
        
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to API. Make sure the server is running on http://localhost:8000")
    except Exception as e:
        print(f"❌ Test failed with error: {e}")

if __name__ == "__main__":
    main()
