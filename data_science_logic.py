import pandas as pd
import sqlite3

def calculate_voting_bloc_correlation(db_path):
    """
    Analyzes the 'votes' table and calculates the 'Voting Bloc Correlation' matrix,
    showing which Council Members vote together.
    """
    try:
        conn = sqlite3.connect(db_path)
        
        # We query the D1 representation db where votes are stored
        query = """
        SELECT item_id, member_name, vote_cast 
        FROM votes 
        WHERE vote_cast IN ('Aye', 'Nay')
        """
        df = pd.read_sql_query(query, conn)
        
        if df.empty:
            return pd.DataFrame()
            
        # Map Aye/Nay to 1/0 for numerical correlation calculation
        df['vote_num'] = df['vote_cast'].map({'Aye': 1, 'Nay': 0})
        
        # Create a pivot table where rows = item_id, columns = member_name, values = 1 or 0
        pivot_df = df.pivot_table(index='item_id', columns='member_name', values='vote_num')
        
        # Generate the Pearson correlation matrix representing the Voting Bloc Correlation
        correlation_matrix = pivot_df.corr()
        
        return correlation_matrix
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        return pd.DataFrame()
    finally:
        if conn:
            conn.close()

def build_member_persona_prompt(member_name, recent_votes_list):
    """
    Creates a 'Member Persona' prompt for Gemini to analyze a given member's last 20 votes.
    Allows for dynamic determination of "Political Trending".
    """
    # Formatting the last 20 votes into a clean list string
    formatted_votes = "\n".join([f"- {vote['title']}: {vote['vote_cast']}" for vote in recent_votes_list])
    
    prompt = f"""
    You are an expert political data scientist analyzing the Minneapolis City Council.
    Please review the last 20 votes made by Council Member {member_name}.

    Recent Votes:
    {formatted_votes}

    Based entirely on the voting record above, please determine this member's current "Political Trending" persona.
    Some examples might include (but are not limited to): 
    - Pro-Transit Reformer
    - Fiscal Hawk
    - Affordable Housing Advocate
    - Law and Order Moderate

    Your Response Format Must Include:
    1. Persona Title: <A concise 2-4 word label>
    2. Summary Analysis: <One paragraph explaining why this persona fits, based on the specific vote topics>
    3. Bloc Deviation: <Note any specific instances where they broke from obvious political norms/factions on key issues>

    Keep the tone extremely analytical, neutral, and data-driven.
    """
    return prompt.strip()

if __name__ == "__main__":
    # Example usage for testing
    print("Voting Bloc Correlation is available via `calculate_voting_bloc_correlation`")
    sample_votes = [
        {"title": "2026 Budget Amendment - Transit Infrastructure", "vote_cast": "Aye"},
        {"title": "Zoning Board Ordinance 2026-11", "vote_cast": "Nay"},
        {"title": "Library Renovation Bonds", "vote_cast": "Aye"}
    ]
    print("\nSample Persona Prompt Output:\n")
    print(build_member_persona_prompt("Jane Doe", sample_votes))
