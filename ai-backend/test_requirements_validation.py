# test_requirements_validation.py
# Comprehensive test to validate all AI assistant requirements

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from graph.graph import create_enhanced_graph
from langchain_core.messages import HumanMessage
import time

class RequirementsValidator:
    def __init__(self):
        self.app = create_enhanced_graph()
        self.test_results = []
        
    def log_test(self, requirement, test_name, success, details=""):
        """Log test results for reporting."""
        self.test_results.append({
            "requirement": requirement,
            "test": test_name, 
            "success": success,
            "details": details
        })
        status = "✅" if success else "❌"
        print(f"{status} {requirement}: {test_name}")
        if details:
            print(f"   Details: {details}")
        print()

    def test_curriculum_grounded_tutoring(self):
        """Test Requirement 1: Curriculum-Grounded Tutoring (Students)"""
        print("="*60)
        print("TESTING: Curriculum-Grounded Tutoring (Students)")
        print("="*60)
        
        test_cases = [
            {
                "name": "Basic Python Concept Question",
                "message": "What is a Python function and how do I use it?",
                "student_level": "beginner"
            },
            {
                "name": "Advanced Programming Concept",
                "message": "Explain object-oriented programming in Python with examples",
                "student_level": "advanced"
            },
            {
                "name": "Web Development Question",
                "message": "How do I handle HTTP requests in JavaScript?",
                "student_level": "intermediate"
            },
            {
                "name": "Personalized Study Tips Request",
                "message": "I'm struggling with Python loops. Can you give me some study tips?",
                "student_level": "beginner"
            }
        ]
        
        for test_case in test_cases:
            try:
                initial_state = {
                    "messages": [HumanMessage(content=test_case["message"])],
                    "user_type": "student",
                    "student_level": test_case["student_level"]
                }
                
                result = self.app.invoke(initial_state)
                
                # Validate response characteristics
                if result and "messages" in result:
                    response = result["messages"][-1].content
                    route_decision = result.get("route_decision", "unknown")
                    
                    # Check if it went through RAG (curriculum-grounded)
                    used_rag = route_decision == "rag" or "retrieved_docs" in result
                    
                    # Check if response is educational and personalized
                    has_educational_content = any(word in response.lower() for word in 
                                                ["example", "concept", "learn", "understand", "practice"])
                    
                    success = used_rag and has_educational_content and len(response) > 100
                    
                    self.log_test(
                        "Curriculum-Grounded Tutoring",
                        test_case["name"],
                        success,
                        f"Route: {route_decision}, Length: {len(response)}, Educational: {has_educational_content}"
                    )
                else:
                    self.log_test(
                        "Curriculum-Grounded Tutoring", 
                        test_case["name"], 
                        False, 
                        "No response generated"
                    )
                    
            except Exception as e:
                self.log_test(
                    "Curriculum-Grounded Tutoring",
                    test_case["name"], 
                    False, 
                    f"Error: {str(e)}"
                )

    def test_on_demand_content_generation(self):
        """Test Requirement 2: On-Demand Content Generation (Students)"""
        print("="*60)
        print("TESTING: On-Demand Content Generation (Students)")
        print("="*60)
        
        test_cases = [
            {
                "name": "Custom Practice Quiz Generation",
                "message": "Create a 5-question quiz on Python functions for beginners",
                "expected_content": ["question", "quiz", "answer"]
            },
            {
                "name": "Flashcard Generation",
                "message": "Generate flashcards for JavaScript variables and data types",
                "expected_content": ["flashcard", "front", "back"]
            },
            {
                "name": "Topic-Specific Practice Material",
                "message": "Make me some practice problems for Python loops",
                "expected_content": ["practice", "problem", "exercise"]
            },
            {
                "name": "Study Material Creation",
                "message": "Create study materials for object-oriented programming concepts",
                "expected_content": ["study", "material", "concept"]
            }
        ]
        
        for test_case in test_cases:
            try:
                initial_state = {
                    "messages": [HumanMessage(content=test_case["message"])],
                    "user_type": "student",
                    "student_level": "intermediate"
                }
                
                result = self.app.invoke(initial_state)
                
                if result and "messages" in result:
                    response = result["messages"][-1].content.lower()
                    route_decision = result.get("route_decision", "unknown")
                    
                    # Check if it went through generation
                    used_generation = route_decision == "generate" or "generated_content" in result
                    
                    # Check if response contains expected content indicators
                    has_expected_content = any(word in response for word in test_case["expected_content"])
                    
                    # Check if it's substantial content (not just a simple response)
                    is_substantial = len(response) > 200
                    
                    success = used_generation and has_expected_content and is_substantial
                    
                    self.log_test(
                        "On-Demand Content Generation",
                        test_case["name"],
                        success,
                        f"Route: {route_decision}, Expected content: {has_expected_content}, Length: {len(response)}"
                    )
                else:
                    self.log_test(
                        "On-Demand Content Generation",
                        test_case["name"], 
                        False, 
                        "No response generated"
                    )
                    
            except Exception as e:
                self.log_test(
                    "On-Demand Content Generation",
                    test_case["name"], 
                    False, 
                    f"Error: {str(e)}"
                )

    def test_adaptive_conversation_management(self):
        """Test Requirement 3: Adaptive Conversation Management (Both Roles)"""
        print("="*60)
        print("TESTING: Adaptive Conversation Management (Both Roles)")
        print("="*60)
        
        # Test conversation continuity and role adaptation
        conversation_tests = [
            {
                "name": "Student Role Adaptation",
                "conversations": [
                    {"role": "student", "level": "beginner", "message": "Hi, I'm new to Python"},
                    {"role": "student", "level": "beginner", "message": "What should I learn first?"},
                    {"role": "student", "level": "beginner", "message": "Can you explain that more simply?"}
                ]
            },
            {
                "name": "Instructor Role Adaptation", 
                "conversations": [
                    {"role": "instructor", "message": "I need help planning my Python course"},
                    {"role": "instructor", "message": "What assessment methods would you recommend?"},
                    {"role": "instructor", "message": "How can I track student progress?"}
                ]
            },
            {
                "name": "Context Awareness Test",
                "conversations": [
                    {"role": "student", "level": "intermediate", "message": "I'm learning about functions"},
                    {"role": "student", "level": "intermediate", "message": "How do parameters work?"},
                    {"role": "student", "level": "intermediate", "message": "Give me an example using what we just discussed"}
                ]
            }
        ]
        
        for conv_test in conversation_tests:
            try:
                conversation_history = []
                context_maintained = True
                role_adapted = True
                
                for i, turn in enumerate(conv_test["conversations"]):
                    # Build conversation history
                    conversation_history.append(HumanMessage(content=turn["message"]))
                    
                    initial_state = {
                        "messages": conversation_history.copy(),
                        "user_type": turn["role"]
                    }
                    
                    if "level" in turn:
                        initial_state["student_level"] = turn["level"]
                    
                    result = self.app.invoke(initial_state)
                    
                    if result and "messages" in result:
                        response = result["messages"][-1].content
                        conversation_history.append(result["messages"][-1])
                        
                        # Check role adaptation
                        if turn["role"] == "student":
                            role_adapted &= any(word in response.lower() for word in 
                                              ["learn", "practice", "understand", "help you"])
                        else:  # instructor
                            role_adapted &= any(word in response.lower() for word in 
                                              ["course", "students", "assessment", "curriculum"])
                        
                        # Check context awareness (later messages should reference earlier context)
                        if i > 0:
                            prev_keywords = turn["message"].lower().split()[:3]
                            context_maintained &= any(word in response.lower() for word in prev_keywords)
                            
                    else:
                        context_maintained = False
                        role_adapted = False
                        break
                
                success = context_maintained and role_adapted
                
                self.log_test(
                    "Adaptive Conversation Management",
                    conv_test["name"],
                    success,
                    f"Context maintained: {context_maintained}, Role adapted: {role_adapted}"
                )
                
            except Exception as e:
                self.log_test(
                    "Adaptive Conversation Management",
                    conv_test["name"], 
                    False, 
                    f"Error: {str(e)}"
                )

    def test_content_creation_assistance(self):
        """Test Requirement 4: Content Creation Assistance (Instructors)"""
        print("="*60)
        print("TESTING: Content Creation Assistance (Instructors)")
        print("="*60)
        
        test_cases = [
            {
                "name": "Supplemental Educational Materials",
                "message": "Help me create supplemental materials for teaching Python loops",
                "expected_features": ["comprehensive", "educational", "material"]
            },
            {
                "name": "Assessment Question Creation",
                "message": "Create formal assessment questions for evaluating Python function knowledge",
                "expected_features": ["assessment", "question", "evaluation"]
            },
            {
                "name": "Educational Insights Request",
                "message": "What are the key learning objectives for object-oriented programming?",
                "expected_features": ["learning", "objective", "insight"]
            },
            {
                "name": "Course Planning Assistance",
                "message": "Help me structure a web development curriculum for beginners",
                "expected_features": ["curriculum", "structure", "planning"]
            }
        ]
        
        for test_case in test_cases:
            try:
                initial_state = {
                    "messages": [HumanMessage(content=test_case["message"])],
                    "user_type": "instructor"
                }
                
                result = self.app.invoke(initial_state)
                
                if result and "messages" in result:
                    response = result["messages"][-1].content.lower()
                    route_decision = result.get("route_decision", "unknown")
                    
                    # Check if response is professional/instructor-focused
                    has_instructor_tone = any(word in response for word in 
                                            ["students", "course", "curriculum", "assessment", "learning objectives"])
                    
                    # Check for expected features
                    has_expected_features = any(word in response for word in test_case["expected_features"])
                    
                    # Check if content is substantial and professional
                    is_professional = len(response) > 150 and has_instructor_tone
                    
                    success = has_expected_features and is_professional
                    
                    self.log_test(
                        "Content Creation Assistance",
                        test_case["name"],
                        success,
                        f"Route: {route_decision}, Professional tone: {has_instructor_tone}, Features: {has_expected_features}"
                    )
                else:
                    self.log_test(
                        "Content Creation Assistance",
                        test_case["name"], 
                        False, 
                        "No response generated"
                    )
                    
            except Exception as e:
                self.log_test(
                    "Content Creation Assistance",
                    test_case["name"], 
                    False, 
                    f"Error: {str(e)}"
                )

    def test_quick_action_functionality(self):
        """Test Requirement 5: Quick Action Functionality (Both Roles)"""
        print("="*60)
        print("TESTING: Quick Action Functionality (Both Roles)")
        print("="*60)
        
        quick_actions = [
            {
                "name": "Student Quiz Generation via Simple Command",
                "user_type": "student",
                "message": "quiz me on Python functions",
                "expected_action": "generate"
            },
            {
                "name": "Instructor Assessment Creation via Simple Command", 
                "user_type": "instructor",
                "message": "create exam questions for loops",
                "expected_action": "generate"
            },
            {
                "name": "Student Practice Request via Simple Command",
                "user_type": "student", 
                "message": "practice coding exercises",
                "expected_action": "practice"
            },
            {
                "name": "Instructor Analytics via Simple Command",
                "user_type": "instructor",
                "message": "show student progress data",
                "expected_action": "analytics"
            },
            {
                "name": "General Help via Simple Command",
                "user_type": "student",
                "message": "explain variables",
                "expected_action": "rag"
            }
        ]
        
        for action_test in quick_actions:
            try:
                initial_state = {
                    "messages": [HumanMessage(content=action_test["message"])],
                    "user_type": action_test["user_type"],
                    "student_level": "intermediate" if action_test["user_type"] == "student" else None
                }
                
                result = self.app.invoke(initial_state)
                
                if result and "messages" in result:
                    response = result["messages"][-1].content
                    route_decision = result.get("route_decision", "unknown")
                    
                    # Check if the simple command was correctly interpreted and routed
                    correct_routing = route_decision == action_test["expected_action"]
                    
                    # Check if response is appropriate for the action
                    response_appropriate = len(response) > 50  # Substantial response
                    
                    # Check response time (simulated - in real app would measure actual time)
                    quick_response = True  # Placeholder for actual timing
                    
                    success = correct_routing and response_appropriate and quick_response
                    
                    self.log_test(
                        "Quick Action Functionality",
                        action_test["name"],
                        success,
                        f"Expected route: {action_test['expected_action']}, Actual: {route_decision}, Appropriate: {response_appropriate}"
                    )
                else:
                    self.log_test(
                        "Quick Action Functionality",
                        action_test["name"], 
                        False, 
                        "No response generated"
                    )
                    
            except Exception as e:
                self.log_test(
                    "Quick Action Functionality",
                    action_test["name"], 
                    False, 
                    f"Error: {str(e)}"
                )

    def generate_report(self):
        """Generate a comprehensive requirements validation report."""
        print("\n" + "="*80)
        print("REQUIREMENTS VALIDATION REPORT")
        print("="*80)
        
        # Group results by requirement
        requirements = {}
        for result in self.test_results:
            req = result["requirement"]
            if req not in requirements:
                requirements[req] = {"passed": 0, "total": 0, "tests": []}
            
            requirements[req]["total"] += 1
            if result["success"]:
                requirements[req]["passed"] += 1
            requirements[req]["tests"].append(result)
        
        overall_passed = 0
        overall_total = 0
        
        for req, data in requirements.items():
            passed = data["passed"]
            total = data["total"]
            percentage = (passed / total * 100) if total > 0 else 0
            
            overall_passed += passed
            overall_total += total
            
            status = "✅ PASS" if percentage >= 80 else "⚠️ PARTIAL" if percentage >= 60 else "❌ FAIL"
            
            print(f"\n{req}:")
            print(f"  {status} - {passed}/{total} tests passed ({percentage:.1f}%)")
            
            # Show failed tests
            failed_tests = [t for t in data["tests"] if not t["success"]]
            if failed_tests:
                print("  Failed tests:")
                for test in failed_tests:
                    print(f"    - {test['test']}: {test['details']}")
        
        overall_percentage = (overall_passed / overall_total * 100) if overall_total > 0 else 0
        overall_status = "✅ SYSTEM READY" if overall_percentage >= 80 else "⚠️ NEEDS WORK" if overall_percentage >= 60 else "❌ NOT READY"
        
        print(f"\nOVERALL SYSTEM STATUS:")
        print(f"{overall_status} - {overall_passed}/{overall_total} total tests passed ({overall_percentage:.1f}%)")
        
        print("\n" + "="*80)
        
        return overall_percentage >= 80

    def run_all_tests(self):
        """Run all requirement validation tests."""
        print("🚀 Starting Comprehensive Requirements Validation")
        print("Testing all 5 core requirements for the AI Assistant...")
        print("\n")
        
        if not self.app:
            print("❌ Failed to initialize the enhanced graph. Cannot proceed with testing.")
            return False
        
        # Run all requirement tests
        self.test_curriculum_grounded_tutoring()
        self.test_on_demand_content_generation() 
        self.test_adaptive_conversation_management()
        self.test_content_creation_assistance()
        self.test_quick_action_functionality()
        
        # Generate and return final report
        return self.generate_report()

if __name__ == "__main__":
    validator = RequirementsValidator()
    system_ready = validator.run_all_tests()
    
    if system_ready:
        print("\n🎉 CONGRATULATIONS! Your AI Assistant meets all requirements and is ready for deployment!")
    else:
        print("\n🔧 Your AI Assistant needs some improvements before it fully meets all requirements.")
    
    print("\nRequirements tested:")
    print("1. ✓ Curriculum-Grounded Tutoring (Students)")
    print("2. ✓ On-Demand Content Generation (Students)")
    print("3. ✓ Adaptive Conversation Management (Both Roles)")
    print("4. ✓ Content Creation Assistance (Instructors)")
    print("5. ✓ Quick Action Functionality (Both Roles)")
