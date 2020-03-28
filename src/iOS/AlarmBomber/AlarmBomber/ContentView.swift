import SwiftUI
import UserNotifications

struct ContentView: View {
    @State private var hour = Int()
    @State private var minute = Int()
    @State private var isShowingPickerH = false
    @State private var isShowingPickerM = false
    @State  var isShowingPickerS = false
    @State  var showingAlert = false
    
    
    var body: some View {
        ZStack {
            LinearGradient(gradient: Gradient(colors: [.red, .black]), startPoint: .top, endPoint: .bottom)
            .edgesIgnoringSafeArea(.all)
            Text("").frame(width: 250.0, height: 100.0).background(Color.green).padding(.bottom, 50.0)
            VStack {
                Text("AlarmBomber").font(.largeTitle).fontWeight(.bold).padding(.bottom, 50.0)
                HStack {
                    Button(action: {
                        self.isShowingPickerM = false
                        self.isShowingPickerH.toggle()
                    }) {
                        Text("\(self.hour)").font(.largeTitle).fontWeight(.bold)
                            .multilineTextAlignment(.trailing)
                            .frame(width: 80.0, height: 100.0)
                    }
                    Text("：").font(.largeTitle).fontWeight(.bold).frame(width: 20.0, height: 100.0)
                    Button(action: {
                        self.isShowingPickerH = false
                        self.isShowingPickerM.toggle()
                    }){
                        Text("\(self.minute)").font(.largeTitle).fontWeight(.bold)
                            .multilineTextAlignment(.trailing)
                            .frame(width: 80.0, height: 100.0)
                    }
                }.padding(.vertical, 50.0)
                Button("SET") {
                    self.showingAlert = true
                    self.isShowingPickerS = true
                    self.isShowingPickerH = false
                    self.isShowingPickerM = false
                    
                    let urlString = "write here URL"

                    let request = NSMutableURLRequest(url: URL(string: urlString)!)

                    request.httpMethod = "POST"
                    request.addValue("application/json", forHTTPHeaderField: "Content-Type")



                    let params:[String:Any] = [
                        "status": false
                    ]

                    do{
                        request.httpBody = try JSONSerialization.data(withJSONObject: params, options: .prettyPrinted)

                        let task:URLSessionDataTask = URLSession.shared.dataTask(with: request as URLRequest, completionHandler: {(data,response,error) -> Void in
                            let resultData = String(data: data!, encoding: .utf8)!
                            print("result:\(resultData)")
                            print("response:\(String(describing: response))")
                        })
                        task.resume()
                    }catch{
                        print("Error:\(error)")
                        return
                    }
                    
                    }.font(.largeTitle).padding(.bottom, 100.0)
                .alert(isPresented: $showingAlert) {
                    Alert(title: Text("アラーム設定"),
                          message: Text("\(self.hour)時\(self.minute)分にアラームをセットします"),
                          primaryButton: .cancel(Text("キャンセル")),    // キャンセル用
                        secondaryButton: .default(Text("OK"),action: {
                            
                            let content = UNMutableNotificationContent()
                            content.title = "警告"
                            content.body = "5分以内に起きなければ、ソースコードを破壊します"
                            content.sound = UNNotificationSound.init(named: UNNotificationSoundName(rawValue: "awakesound.mp3"))

                            let date = DateComponents(hour:self.hour, minute:self.minute)
                            let trigger = UNCalendarNotificationTrigger.init(dateMatching: date, repeats: false)
                            let request = UNNotificationRequest.init(identifier: "CalendarNotification", content: content, trigger: trigger)

                            UNUserNotificationCenter.current().add(request, withCompletionHandler: nil)
                            
                            
                        }))
                }
            }
            
            SaveMode(hour: self.$hour, minute: self.$minute , isShowing: self.$isShowingPickerS).animation(.linear)
            .offset(y: self.isShowingPickerS ? 0 : UIScreen.main.bounds.height)
            
            
            NumberPickerH(selection: self.$hour, isShowing: self.$isShowingPickerH)
                .animation(.linear)
                .offset(y: self.isShowingPickerH ? 0 : UIScreen.main.bounds.height)
            
            NumberPickerM(selection: self.$minute, isShowing: self.$isShowingPickerM)
                .animation(.linear)
                .offset(y: self.isShowingPickerM ? 0 : UIScreen.main.bounds.height)
                
        }
    }
}

struct NumberPickerH: View {
    @Binding var selection: Int
    @Binding var isShowing: Bool
    var body: some View {
        
        VStack {
            Spacer()
            Button(action: {
                self.isShowing = false
            }) {
                HStack {
                    Spacer()
                    Text("決定")
                        .padding(.horizontal, 16)
                }
            }
            
            Picker(selection: $selection, label: Text("")) {
                ForEach((0..<24), id: \.self) {
                    Text("\($0)時")
                        .tag($0)
                }
            }
            .frame(width: 200)
            .labelsHidden()
        }
    }
}
struct NumberPickerM: View {
    @Binding var selection: Int
    @Binding var isShowing: Bool
    var body: some View {
        VStack {
            Spacer()
            Button(action: {
                self.isShowing = false
            }) {
                HStack {
                    Spacer()
                    Text("決定")
                        .padding(.horizontal, 16)
                }
            }
            
            Picker(selection: $selection, label: Text("")) {
                ForEach((0..<60), id: \.self) {
                    Text("\($0)分")
                        .tag($0)
                }
            }
            .frame(width: 200)
            .labelsHidden()
        }
    }
}

struct SaveMode:View{
    @Binding var hour:Int
    @Binding var minute:Int
    @Binding var isShowing: Bool
    var body: some View {
        ZStack{
            LinearGradient(gradient: Gradient(colors: [.blue, .black]), startPoint: .top, endPoint: .bottom)
            .edgesIgnoringSafeArea(.all)
            VStack{
                Text("現在アラームが\n\(self.hour)時\(self.minute)分\nにセットされています").font(.largeTitle).fontWeight(.bold).padding(.all,50)
                Button(action: {
                    let center = UNUserNotificationCenter.current()
                    center.removeAllDeliveredNotifications()
                    center.removeAllPendingNotificationRequests()
                    center.removeDeliveredNotifications(withIdentifiers: ["your notification identifier"])
                    self.isShowing = false
                    
                }) {
                    Text("取り消しする").font(.largeTitle).fontWeight(.bold)
                }
                
            }
        }
    }
}













struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
