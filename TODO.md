Look at jscpd fragments. The duplicates seem not to be identical.
Apparently whitespace is ignored or probably compacted.
I see additional tikens on most lines:
Views/AVDataView.swift:
129 │ }                                                    
130 │                                                      
131 │     var body: some View {                            
132 │         VStack(alignment: .leading) {                
133 │             if !errorMsg.isEmpty {                   
134 │                 Text(errorMsg).foregroundStyle(.red)
135 │             } else                                   
Views/Personal/AllRowTableView.swift:
120 │ }                                          
121 │     var body: some View {                  
122 │         VStack(alignment: .leading) {      
123 │             if !errorMsg.isEmpty {         
124 │                 Text(errorMsg)             
125 │                     .foregroundStyle(.red)
126 │             }                              
127 │             @ 

5 lines, 53 tokens
Views/Personal/APICallsView.swift:
160 │ : View {                                                               
161 │     @Environment(StockDataAccess.self) private var avAccess            
162 │     @Environment(AccountPortfolioContainer.self) private var container
163 │     @Environment(CallerSpecModel.self) private var callerSpec          
164 │                                                                        
165 │     let                                                                
Views/Personal/APICallsView.swift:
63 │ : View {                                                               
64 │     @Environment(StockDataAccess.self) private var avAccess            
65 │     @Environment(AccountPortfolioContainer.self) private var container
66 │     @Environment(CallerSpecModel.self) private var callerSpec          
67 │     @                 

The most annoying are the trailing tokens.
Inspect jscpd clone source and/or jscpd issues.

It also looks like the fragments contain colour info, probably representing (internal?) whitespace.

