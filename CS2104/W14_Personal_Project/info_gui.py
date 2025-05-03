import time
import requests
import tkinter as tk
from tkinter import messagebox
from PIL import Image, ImageTk  # Requires pillow installed

OPENWEATHER_API_KEY = "ef796d6b13ddf32cb572bcd38e2db662"
WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather"
CRYPTO_API_URL = "https://api.coingecko.com/api/v3/simple/price"

# Weather Function
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

# Crypto Function
def get_crypto(symbol):
    symbol = symbol.lower()
    params = {"ids": symbol, "vs_currencies": "usd"}
    try:
        response = requests.get(CRYPTO_API_URL, params=params)
        data = response.json()

        if response.status_code == 200 and symbol in data and "usd" in data[symbol]:
            return f"{symbol.upper()} price: ${data[symbol]['usd']}"
        else:
            time.sleep(1)
            response = requests.get(CRYPTO_API_URL, params=params)
            data = response.json()
            if response.status_code == 200 and symbol in data and "usd" in data[symbol]:
                return f"{symbol.upper()} price: ${data[symbol]['usd']}"
            else:
                return f"Error: Data temporarily unavailable for '{symbol.upper()}'"
    except Exception as e:
        return f"Error: {str(e)}"

# Updates background based on selected mode
def update_background():
    mode = mode_var.get()
    if mode == "Weather":
        canvas.itemconfig(background_image_id, image=sky_img)
        mode_label.config(fg="black", font=("Helvetica", 12, "bold"))
        weather_radio.config(fg="black", font=("Helvetica", 10, "bold"))
        crypto_radio.config(fg="black", font=("Helvetica", 10, "normal"))
    else:
        canvas.itemconfig(background_image_id, image=stock_img)
        mode_label.config(fg="white", font=("Helvetica", 12, "bold"))
        weather_radio.config(fg="white", font=("Helvetica", 10, "normal"))
        crypto_radio.config(fg="white", font=("Helvetica", 10, "bold"))


def refresh_data():
    update_background()
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

# GUI Setup
root = tk.Tk()
root.title("Real-Time Info Dashboard")
root.geometry("600x400")  # Increased size

# Load background images
sky_img = ImageTk.PhotoImage(Image.open("CS2104/W14_Personal_Project/sky_background.png").resize((600, 400)))
stock_img = ImageTk.PhotoImage(Image.open("CS2104/W14_Personal_Project/stocks_background.png").resize((600, 400)))

# Canvas for background image
canvas = tk.Canvas(root, width=600, height=400)
canvas.pack(fill="both", expand=True)
background_image_id = canvas.create_image(0, 0, anchor="nw", image=sky_img)  # Default to sky

# Widgets (placed on canvas)
mode_var = tk.StringVar(value="Weather")

mode_label = tk.Label(root, text="Choose Mode:", font=("Helvetica", 12, "bold"), fg="black")
weather_radio = tk.Radiobutton(root, text="Weather", variable=mode_var, value="Weather",
                               command=update_background, font=("Helvetica", 10, "bold"), fg="black", highlightthickness=0, bd=0, background=root.cget("bg"))
crypto_radio = tk.Radiobutton(root, text="Crypto", variable=mode_var, value="Crypto",
                              command=update_background, font=("Helvetica", 10), fg="black", highlightthickness=0, bd=0, background=root.cget("bg"))

input_field = tk.Entry(root, width=30)
get_info_button = tk.Button(root, text="Get Info", command=refresh_data)
output_label = tk.Label(root, text="", wraplength=500, justify="center", fg="black", font=("Helvetica", 11), background=root.cget("bg"))

# Place widgets on canvas
canvas.create_window(300, 40, window=mode_label)
canvas.create_window(250, 70, window=weather_radio)
canvas.create_window(350, 70, window=crypto_radio)
canvas.create_window(300, 120, window=input_field)
canvas.create_window(300, 160, window=get_info_button)
canvas.create_window(300, 230, window=output_label)

root.mainloop()
