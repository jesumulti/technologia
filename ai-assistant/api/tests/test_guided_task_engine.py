import unittest
from ai_assistant.api.services.guided_task_engine import GuidedTaskEngine

class TestGuidedTaskEngine(unittest.TestCase):
    def test_methods(self):
        engine = GuidedTaskEngine()
        self.assertEqual(engine.get_next_step("123"), "get_next_step")
        self.assertEqual(engine.get_previous_step("123"), "get_previous_step")
        self.assertEqual(engine.handle_error("123"), "handle_error")

if __name__ == '__main__':
    unittest.main()