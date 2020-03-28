import UIKit
import UserNotifications

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
    {
        UNUserNotificationCenter.current()
            .requestAuthorization(options: [.badge, .sound, .alert], completionHandler: { (granted, error) in
                if !granted {
                    let alert = UIAlertController(title: "エラー", message: "プッシュ通知が拒否されています。設定から有効にしてください。", preferredStyle: .alert)
                    let closeAction = UIAlertAction(title: "閉じる", style: .default) { _ in exit(1) }
                    alert.addAction(closeAction)
                    self.window?.rootViewController?.present(alert, animated: true, completion: nil)
                }
            })
        UNUserNotificationCenter.current().delegate = self
        
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
   }

    func applicationDidEnterBackground(_ application: UIApplication) {
   }

    func applicationWillEnterForeground(_ application: UIApplication) {
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
    }

    func applicationWillTerminate(_ application: UIApplication) {
    }
}

extension AppDelegate: UNUserNotificationCenterDelegate {
    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification,
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void)
    {
        
        let urlString = "write here URL"

        let request = NSMutableURLRequest(url: URL(string: urlString)!)

        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")



        let params:[String:Any] = [
            "status": true
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
        //以下が通知処理を行う部分
        completionHandler([ .badge, .sound, .alert ])
    }
}
