# info_gui.py

import requests
import tkinter as tk
from tkinter import messagebox

OPENWEATHER_API_KEY = "ef796d6b13ddf32cb572bcd38e2db662" 
WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather"
CRYPTO_API_URL = "https://api.coingecko.com/api/v3/simple/price"

def get_weather(city):
    try:
        params = {"q": city, "appid": OPENWEATHER_API_KEY, "units": "metric"}
        response = requests.get(WEATHER_API_URL, params=params)
        data = response.json()
        if response.status_code == 200:
            return f"Weather in {city}:\n{data['weather'][0]['description'].title()}, {data['main']['temp']}°C"
        else:
            return f"Error: {data.get('message', 'Unable to fetch weather')}"
    except Exception as e:
        return f"Error: {str(e)}"

def get_crypto(symbol):
    try:
        response = requests.get(CRYPTO_API_URL, params={"ids": symbol.lower(), "vs_currencies": "usd"})
        data = response.json()
        if symbol.lower() in data:
            return f"{symbol.upper()} price: ${data[symbol.lower()]['usd']}"
        else:
            return f"Error: Cryptocurrency symbol '{symbol}' not found"
    except Exception as e:
        return f"Error: {str(e)}"

def refresh_data():
    user_input = input_field.get()
    mode = mode_var.get()
    if not user_input:
        messagebox.showwarning("Missing Input", "Enter a city or crypto symbol.")
        return
    if mode == "Weather":
        result = get_weather(user_input)
    else:
        result = get_crypto(user_input)
    output_label.config(text=result)

root = tk.Tk()
root.title("Real-Time Info Dashboard")
root.geometry("400x250")

mode_var = tk.StringVar(value="Weather")
tk.Label(root, text="Choose Mode:").pack()
tk.Radiobutton(root, text="Weather", variable=mode_var, value="Weather").pack()
tk.Radiobutton(root, text="Crypto", variable=mode_var, value="Crypto").pack()

input_field = tk.Entry(root, width=30)
input_field.pack(pady=10)

tk.Button(root, text="Get Info", command=refresh_data).pack()
output_label = tk.Label(root, text="", wraplength=350, justify="center")
output_label.pack(pady=20)


root.mainloop()
