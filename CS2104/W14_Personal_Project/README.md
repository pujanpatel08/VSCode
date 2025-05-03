# Real-Time Info Dashboard

This project is a Python-based dashboard that fetches **real-time weather** and **cryptocurrency** data using free public APIs. It includes two interfaces:
1. A terminal (command-line) interface
2. A graphical interface (GUI) built with Tkinter

---

## 🔧 Features

- Choose between **Weather** and **Crypto** modes
- Enter a **city name** or **cryptocurrency symbol**
- Fetch live data using:
  - [OpenWeatherMap API](https://openweathermap.org/api) for weather (requires API key)
  - [CoinGecko API](https://www.coingecko.com/en/api) for cryptocurrency (free without API key)
- Clean error handling and intuitive output

---

## 🗂 File Structure

| File            | Purpose                                    |
|-----------------|--------------------------------------------|
| `info_terminal.py` | Terminal-based version of the app          |
| `info_gui.py`       | Tkinter-based graphical version             |
| `README.md`         | Project overview and setup instructions     |

---

## ▶️ Running the Apps

### ✅ Prerequisites
- Python 3.7+
- `requests` library

Install dependencies with:

```bash
pip install requests
```

### 🌤 Weather API Key
1. Sign up at [OpenWeatherMap](https://openweathermap.org/)
2. Copy your free API key
3. Replace `"your_openweather_api_key_here"` in both `.py` files

---

### 🖥 Terminal Version

```bash
python info_terminal.py
```

Follow the prompts to choose a mode and input a city or symbol.

---

### 🪟 GUI Version

```bash
python info_gui.py
```

Use radio buttons to select Weather or Crypto, type input, and click **"Get Info"**.

---

## 📌 Notes

- CoinGecko does **not** require an API key.
- OpenWeatherMap **does** require one — it's free and quick to get.
- To test the GUI, make sure you're running in an environment with a graphical display.

---

## 👨‍💻 Author
Group 43 – CS Personal Programming Project

