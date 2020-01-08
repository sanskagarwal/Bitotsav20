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

int main()
{
	freopen("events.txt", "r", stdin);
	freopen("output.txt", "w", stdout);

    ios::sync_with_stdio(0);
    cin.tie(0);
    cout.tie(0);

	// Clean Data
	string s;
	while (getline(cin, s)) {
		for(int i=0;i<s.size();i++) {
			int ch=s[i];
			if(ch<0 || ch>127)
			s[i]=' ';
		}
		trim(s);
		if(s.size()==0) // Skip Empty Line
		continue;
		cout << s << "\n";
	}

    return 0;
}