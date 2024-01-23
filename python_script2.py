import requests
from bs4 import BeautifulSoup
import json
import sys

try:
    data = str(sys.argv[1])
    url = "https://www.ebay.com/sch/i.html?_nkw="+data
    r = requests.get(url)
    soup = BeautifulSoup(r.content, "html.parser")

    products = soup.find_all("li", class_="s-item")

    product_data = []

    for product in products:
        data = {}

        # Extract product name
        name_div = product.find("div", class_="s-item__title")
        name_span = name_div.find("span", role="heading")
        data["name"] = name_span.text.strip() if name_span else name_div.text.strip()
        # name_element = product.find("h3", class_="s-item__title")
        # if name_element:
        #     data["name"] = name_element.text.strip()
        
        # Extract product price
        price_element = product.find("span", class_="s-item__price")
        if price_element:
            data["price"] = price_element.text.strip()

        # Extract image link
        image_div = product.find("div", class_="s-item__image-wrapper")
        image = image_div.find("img")
        data["image_link"] = image["src"] if image else None
        
         # Extract rating
        # rating_element = product.find("div", class_="_3LWZlK")
        # data["rating"] = rating_element.text.strip() if rating_element else None
        data["rating"]=4.2

        # Extract product link
        link_element = product.find("a", class_="s-item__link")
        if link_element:
            data["product_link"] = link_element["href"]
        
        # Append the product data to the list
        product_data.append(data)

    # Convert the list of dictionaries to a JSON array
    json_array = json.dumps(product_data, indent=4)

    # Print the JSON array
    print(json_array)

except Exception as e:
    # Print the error message to stderr
    print("Error:", str(e), file=sys.stderr)
    sys.exit(1)
