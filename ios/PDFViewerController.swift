import UIKit
import PDFKit

protocol BAPDFViewerDelegate: AnyObject {
    func resultPDFView(resultCode: NSInteger, resultString: NSString)
}

class BAPDFViewerViewController: UIViewController, UIAdaptivePresentationControllerDelegate {
    var sourceType:String = ""
    var pdfSource:String = ""

    var useBackgroundColor: String = ""
    var useTextColor: String = ""

    let mainTextField =  UITextView()

    weak var delegate:BAPDFViewerDelegate?

    var asSingleton:Bool = false

    var screenWidth = UIScreen.main.bounds.size.width
    var screenHeight = UIScreen.main.bounds.size.height

    let pdfView = PDFView()
  
    let toolBarHeight: CGFloat = 44;
  
    lazy var toolBar: UIToolbar = {
        let tb = UIToolbar(frame: CGRect(x: 0, y: 0, width: screenWidth, height: toolBarHeight))
        
        tb.backgroundColor = UIColor(hex: self.useBackgroundColor + "ff")
        tb.barTintColor = UIColor(hex: self.useBackgroundColor + "ff")
        tb.tintColor = UIColor(hex: self.useTextColor + "ff")
        
        return tb
    }()
  
    func toolBarButtons() -> [UIBarButtonItem] {
      let backIcon: UIBarButtonItem = UIBarButtonItem(image: UIImage(systemName: "chevron.backward"), landscapeImagePhone: UIImage(systemName: "chevron.backward"), style:.done, target: self, action: #selector(cancel(sender:)))
      let backLabel: UIBarButtonItem = UIBarButtonItem(title: "Zurück", style:.done, target: self, action: #selector(cancel(sender:)))
      
      return [backIcon, backLabel]
    }
  
    override func viewDidLoad() {
      print("PDFViewerViewController :: viewDidLoad");
      print("PDFViewerViewController :: sourceType", sourceType);
      print("PDFViewerViewController :: source", pdfSource);

      super.viewDidLoad()
    
      // Place the button in the tool bar.
      self.toolBar.items = toolBarButtons()
      self.view.addSubview(self.toolBar)

      self.view.backgroundColor = UIColor.white

      self.showSpinner(onView: self.view)

      // Add PDFView to view controller.
      pdfView.frame = CGRect(x: 0, y: toolBarHeight, width: screenWidth, height: (screenHeight - toolBarHeight))

      // Fit content in PDFView.
      pdfView.autoScales = true

      //pdfView.displayMode = .singlePageContinuous
      //pdfView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
      //pdfView.displaysAsBook = true
      //pdfView.displayDirection = .vertical
      //pdfView.maxScaleFactor = 4.0
      //pdfView.minScaleFactor = pdfView.scaleFactorForSizeToFit

      // load PDF
      DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
        guard let url = URL(string: self.pdfSource) else {return}
        do {
          let data = try Data(contentsOf: url)
          let pdfDocument = PDFDocument(data: data)

          self.pdfView.document = pdfDocument

          self.view.addSubview(self.pdfView)

          self.removeSpinner()
        } catch let err {
          print(err.localizedDescription)

          self.delegate?.resultPDFView(resultCode: 402, resultString: "SOURCE_NOT_READABLE:" + err.localizedDescription as NSString)
          self.dismiss(animated: true, completion: nil)
        }
      }
    }

    override func viewDidLayoutSubviews() {
        print("CommentTextareaViewController :: self.screenWidth", self.screenWidth);
        print("CommentTextareaViewController :: self.view.frame.width", self.view.frame.width);

        pdfView.frame = CGRect(x: 0, y: 60, width: self.view.frame.width, height: (self.view.frame.height - 60))
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // DIsmissal from swpie, iOS 13
    func presentationControllerDidDismiss(_ presentationController: UIPresentationController) {
       print("did dismiss")
       self.delegate?.resultPDFView(resultCode: 101, resultString: "ABORTED")
    }

    func manageTopBar() {
        self.navigationItem.hidesBackButton = true
        let newBackButton = UIBarButtonItem(barButtonSystemItem: .cancel, target: self, action: #selector(BAPDFViewerViewController.cancel(sender:)))
        self.navigationItem.leftBarButtonItem = newBackButton

        if !self.asSingleton {
            print("HIDESME PDF")
            self.navigationController?.navigationBar.isHidden = true
        }
    }

    // cancel button
    @objc func cancel(sender: UIBarButtonItem) {
        print("PDFViewerViewController :: back");

        self.delegate?.resultPDFView(resultCode: 101, resultString: "ABORTED")

        self.dismiss(animated: true, completion: nil)
    }
}
