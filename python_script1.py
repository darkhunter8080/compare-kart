import requests
from bs4 import BeautifulSoup
import json
import sys
try:
    data = str(sys.argv[1])
    url="https://www.flipkart.com/search?q="+data
    r = requests.get(url)
    soup = BeautifulSoup(r.text, "html.parser")

    products = soup.find_all("a", class_="_1fQZEK")

    product_data = []

    for product in products:
        data = {}
    
        # Extract product name
        data["name"] = product.find("div", class_="_4rR01T").text.strip()
    
        # Extract product price and remove the Unicode character
        price = product.find("div", class_="_30jeq3").text.strip()
        data["price"] = price.encode('ascii', 'ignore').decode('unicode_escape')
    
        # Extract image link
        data["image_link"] = product.find("img", class_="_396cs4")["src"]
    
        # Extract rating
        rating_element = product.find("div", class_="_3LWZlK")
        data["rating"] = rating_element.text.strip() if rating_element else None
    
        # Extract specifications as a list
        specs = product.find("div", class_="fMghEO").text.strip().split("\n")
        data["specification"] = [spec.strip() for spec in specs if spec.strip()]
    
        # Extract product link
        data["product_link"] = "https://www.flipkart.com" + product["href"]
    
        # Append the product data to the list
        product_data.append(data)

    # Convert the list of dictionaries to a JSON array
    json_array = json.dumps(product_data, indent=4)

    # Print the JSON array
    # print(json_array)
    print(json_array)

except Exception as e:
    # Print the error message to stderr
    print("Error:", str(e), file=sys.stderr)
    sys.exit(1)
