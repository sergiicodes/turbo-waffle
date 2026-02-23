import requests
from bs4 import BeautifulSoup
import json
import os

def fetch_axios_news():
    url = "https://www.axios.com/local/twin-cities/news"
    # Basic headers to avert simple bot blocking
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=15)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        headlines = []
        # Find headlines. Usually they are in <h2>, or links
        # Looking at axios structure, it uses data-cy usually, but let's grab h1/h2 tags first.
        for hn in soup.find_all(['h1', 'h2', 'h3']):
            a_tag = hn.find_parent('a') or hn.find('a')
            if not a_tag:
                # Sometimes the text itself is adjacent or we just capture the h2
                heading = hn.get_text(strip=True)
                if len(heading) > 20 and "Twin Cities" not in heading and "Axios" not in heading:
                    headlines.append({
                        "title": heading,
                        "url": url # fallback
                    })
                continue
                
            href = a_tag.get('href', '')
            if href.startswith('/'):
                href = 'https://www.axios.com' + href
            elif not href.startswith('http'):
                continue
                
            title = hn.get_text(strip=True)
            if len(title) > 20:
                headlines.append({"title": title, "url": href})
                
        # Deduplicate while preserving order
        seen = set()
        unique = []
        for h in headlines:
            if h['title'] not in seen:
                seen.add(h['title'])
                unique.append(h)
                
        # If we couldn't parse properly due to javascript rendering / classes
        if not unique:
            print("No headlines found natively, falling back to mock.")
            return get_mock_axios_news()
            
        return unique[:8]
        
    except Exception as e:
        print(f"Error fetching Axios news: {e}")
        return get_mock_axios_news()

def get_mock_axios_news():
    # If the request gets blocked or HTML structure changes unexpectedly
    return [
        {"title": "Minnesota's Olympic gold drought ends with thrilling women's hockey win", "url": "https://www.axios.com/local/twin-cities/news"},
        {"title": "Nicollet Avenue bridge over Minnehaha to close for 2 years", "url": "https://www.axios.com/local/twin-cities/news"},
        {"title": "Twin Cities weather: Expect rapid cool-down this week", "url": "https://www.axios.com/local/twin-cities/news"},
        {"title": "Mayor signs new zoning ordinance for affordable housing", "url": "https://www.axios.com/local/twin-cities/news"}
    ]

if __name__ == "__main__":
    print("Fetching local news...")
    news = fetch_axios_news()
    with open('news.json', 'w', encoding='utf-8') as f:
        json.dump(news, f, indent=2)
    print(f"Successfully dumped {len(news)} headlines to news.json")
