/*
 
 * This code is written by Sanskar Agarwal
 
*/
#include <bits/stdc++.h>

using namespace std;

#define ll long long
#define PII pair<int, int>
#define PLL pair<ll, ll>
#define VPLL vector<PLL>
#define VPII vector<PII>
#define PQ priority_queue<PLL, VPLL, greater<PLL>>
#define PQI priority_queue<PII, VPII, greater<PII>>
#define UMLL unordered_map<ll, ll>
#define UMII unordered_map<int, int>
#define VI vector<int>
#define VL vector<ll>
#define S second
#define F first
#define PB push_back

static inline void ltrim(std::string &s) {
    s.erase(s.begin(), std::find_if(s.begin(), s.end(), [](int ch) {
        return !std::isspace(ch);
    }));
}

static inline void rtrim(std::string &s) {
    s.erase(std::find_if(s.rbegin(), s.rend(), [](int ch) {
        return !std::isspace(ch);
    }).base(), s.end());
}

static inline void trim(std::string &s) {
    ltrim(s);
    rtrim(s);
}

string srch[] = {"category", "venue", "duration", "faculty advisors", "club", "points", "description", "rules and regulations", "contact information", "resources required"};
int n=10; // Size of search Array

string findWord(string s) {
	int i;
	transform(s.begin(), s.end(), s.begin(), ::tolower);
	for(i=0;i<n;i++) {
		size_t ind = s.find(srch[i]);
		if (ind==string::npos) {
			continue;
		}
		if(ind!=0) {
			continue;
		}
		return srch[i];
	}
	return "NaN";
}

int main()
{
	freopen("events.txt", "r", stdin);
	freopen("output.txt", "w", stdout);

    ios::sync_with_stdio(0);
    cin.tie(0);
    cout.tie(0);

    /* Required

    * Name (Before Category)
    * Category (E)
    * Venue (E)
    * Duration (E)
    * Faculty Advisors (E)
    * Club
    * Points (May or May not)
    * Description / (with :)
    * Rules and Regulations
    * Contact Information
    * Resources Required
    */

    int i;
	cout << "[\n";
	string s,prev;
	while (getline(cin, s)) {
		
		trim(s);
		if(s.size()==0) // Empty Line
		continue;

		string key = findWord(s);
		if(key != "category") {
			prev=s;
			continue;
		}
		cout << "{\n";
		cout << "\"Name\": `" << prev << "`\n";

		for(i=0;i<n;i++) {
			string key = findWord(s);
			int st=key.size();
			if(s.size() == st || s.size() == (st+1)) { // Content starts from next line
				string val="";
				while (getline(cin, s)) {
					trim(s);
					if(findWord(s) == "NaN") {
						val.append(s+"\n");
					}
					else {
						cout << ",\"" << key << "\"" << ": `" << val << "`";
						break;
					}
					prev=s; // Store Previous Read String
				}
			} else if(s.size() > st) {
				if(s[st]==':') { // There might be a colon
					st++;
				}
				while(s[st]==' ') // Skip Spaces
					st++;
				cout << ",\"" << key << "\": `" << string(s.begin() + st, s.end()) << "`";
				prev=s;
				while (getline(cin, s)) {
					trim(s);
					break;
				}
			} else {
				cout << "Is it possible??";
			}
			cout << "\n";
		}
		cout << "},\n";
		prev=s; // Store Previous Read String (It contains name of the Event)
	}
	cout << "]";

    return 0;
}