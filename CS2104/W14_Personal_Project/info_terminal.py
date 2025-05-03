# info_terminal.py

import requests

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

# Crypto Function with retry, symbol normalization, and error handling
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
    
def run_terminal_version():
    print("Welcome to Real-Time Info Dashboard (Terminal Version)")
    mode = input("Enter mode (weather/crypto): ").strip().lower()
    if mode == "weather":
        city = input("Enter city name: ").strip()
        print(get_weather(city))
    elif mode == "crypto":
        symbol = input("Enter cryptocurrency symbol (e.g., bitcoin): ").strip()
        print(get_crypto(symbol))
    else:
        print("Invalid mode selected. Choose 'weather' or 'crypto'.")

run_terminal_version()
