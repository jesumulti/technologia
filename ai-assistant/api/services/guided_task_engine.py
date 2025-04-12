class GuidedTaskEngine:
    def get_next_step(self, sessionId):
        return "get_next_step"

    def get_previous_step(self, sessionId):
        return "get_previous_step"

    def handle_error(self, sessionId):
        return "handle_error"