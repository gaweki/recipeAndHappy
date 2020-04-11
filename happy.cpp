#include <iostream>
#include <cmath>

using namespace std;

int main()
{
  string n;
  cout << "Input: " ;
  cin >> n;
  int i = 0; 
  string r = "";
  while(r != "true"){
      for(int j = 0;j < n.length(); j++){ 
          float power = 2.0;  
          i += pow(n[j] - '0',power);  
      } 
      n = to_string(i);   
      
      if(i == 1){
          cout << "Output: true";
          return 0; 
      } else if(i == 42){
          return 0;
      }
      i = 0;
  }
}
