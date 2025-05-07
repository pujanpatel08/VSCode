import tkinter as tk
from tkinter import messagebox
import random

questions = [
    {
        "question": "What are the five properties of a well-defined algorithm?",
        "options": [
            "Finiteness, definiteness, input, output, and effectiveness",
            "Speed, logic, precision, complexity, and order",
            "Structure, loops, conditions, recursion, and flow",
            "Design, execution, clarity, code, and result"
        ],
        "answer": 0
    },
    {
        "question": "What is Big-O notation used for?",
        "options": [
            "To represent the output of a function",
            "To explain algorithm design",
            "To express computational complexity of an algorithm",
            "To show how functions call each other"
        ],
        "answer": 2
    },
    {
        "question": "How does binary search improve over linear search in terms of efficiency?",
        "options": [
            "It searches unsorted lists faster",
            "It always finds the element in one step",
            "It divides the list into thirds",
            "It uses O(log n) time instead of O(n)"
        ],
        "answer": 3
    }
]

random.shuffle(questions)

class QuizApp:
    def __init__(self, root):
        self.root = root
        self.root.title("CS2104 Quiz")
        self.root.geometry("700x300")
        self.current_question = 0
        self.incorrect_questions = []
        self.retaking_incorrect = False
        self.questions = questions
        self.build_widgets()

    def build_widgets(self):
        self.question_label = tk.Label(self.root, text="", wraplength=600, font=("Helvetica", 14))
        self.question_label.pack(pady=20)

        self.var = tk.IntVar()
        self.options = []
        for i in range(4):
            rb = tk.Radiobutton(self.root, text="", variable=self.var, value=i, font=("Helvetica", 12))
            rb.pack(anchor="w")
            self.options.append(rb)

        self.submit_button = tk.Button(self.root, text="Submit", command=self.check_answer)
        self.submit_button.pack(pady=10)

        self.load_question()

    def load_question(self):
        if self.current_question < len(self.questions):
            q = self.questions[self.current_question]
            self.var.set(-1)
            self.question_label.config(text=q["question"])
            for i, opt in enumerate(q["options"]):
                self.options[i].config(text=opt)
        else:
            if not self.retaking_incorrect and self.incorrect_questions:
                self.questions = self.incorrect_questions.copy()
                self.incorrect_questions = []
                self.current_question = 0
                self.retaking_incorrect = True
                messagebox.showinfo("Retake Quiz", "Retaking questions you got wrong.")
                self.load_question()
            else:
                messagebox.showinfo("Quiz Complete", "You got all questions correct!")
                self.root.quit()

    def check_answer(self):
        selected = self.var.get()
        if selected == -1:
            messagebox.showwarning("No selection", "Please select an answer.")
            return

        correct_answer = self.questions[self.current_question]["answer"]
        if selected == correct_answer:
            self.current_question += 1
            self.load_question()
        else:
            messagebox.showerror("Incorrect", "Wrong answer. Try again.")
            if not self.retaking_incorrect and self.questions[self.current_question] not in self.incorrect_questions:
                self.incorrect_questions.append(self.questions[self.current_question])

if __name__ == "__main__":
    root = tk.Tk()
    app = QuizApp(root)
    root.mainloop()
