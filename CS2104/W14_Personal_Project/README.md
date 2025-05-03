# Adjusted README with two sections: (1) How it was created, (2) How to use

adjusted_readme = """# Real-Time Info Dashboard

This Python project displays **real-time weather** and **cryptocurrency prices** using public APIs. It includes:
1. A terminal-based interface
2. A graphical GUI using Tkinter

---

## 🛠️ Part 1: How This Was Created

This project was designed, developed, and tested over 10 hours as part of a personal programming project. Here's how it was built:

- **Languages & Tools:** Python 3, `requests` for API calls, `tkinter` for GUI
- **APIs Used:**
  - [OpenWeatherMap API](https://openweathermap.org/api) to get weather data (requires free API key)
  - [CoinGecko API](https://www.coingecko.com/en/api) to get real-time cryptocurrency data (no key needed)
- **Process:**
  - Began by researching API integration and exploring Python libraries.
  - Created a terminal-based script that uses user input to fetch and display data.
  - Then developed a GUI interface using Tkinter with radio buttons and a refresh button.
  - Added error handling and input validation.
  - Tested both versions and ensured user-friendly output.

---

## 🧑‍💻 Part 2: How to Use This Project

### ✅ Requirements
- Python 3.7+
- `requests` library (install via `pip install requests`)

---

### 📂 Files

| File            | Purpose                                    |
|-----------------|--------------------------------------------|
| `info_terminal.py` | Command-line version of the dashboard       |
| `info_gui.py`       | Graphical Tkinter-based version             |
| `README.md`         | Instructions and documentation              |

---

### 🔐 Set Up Your Weather API Key

1. Register for a free API key at [OpenWeatherMap](https://openweathermap.org/)
2. Replace `"your_openweather_api_key_here"` in both `.py` files with your actual API key

---

### ▶️ To Run the Terminal Version:

```bash
python info_terminal.py
