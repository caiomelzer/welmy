import 'dart:async';

import 'package:barcode_scan/barcode_scan.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class HomePage extends StatefulWidget {
  @override
  _ScanState createState() => new _ScanState();
}

class _ScanState extends State<HomePage> {
  String barcode = "";

  @override
  initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[350],
      body: new ListView(
        children: <Widget>[
          Row(
            children:[
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Padding(
                      padding: EdgeInsets.only(left: 10.0),
                      child: Image.asset('assets/images/logo.png', width: 80, height: 100,),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: <Widget>[
                    Padding(
                      padding: EdgeInsets.only(right: 0),
                      child: IconButton(
                        iconSize: 40,
                        color: Colors.black38,
                        icon: Icon(Icons.view_headline),
                        tooltip: 'Increase volume by 10',
                        onPressed: () {},
                      )
                    )
                  ],
                ),
              )
            ],
          ),
          Row(
            children: <Widget>[
              Container(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Padding(
                      padding: EdgeInsets.fromLTRB(20,0,25,0),
                      child: IconButton(
                        icon: Image.asset('assets/images/qrcode-trans.png'),
                        iconSize: 60,
                        onPressed: scan,
                      ),
                    )
                  ],
                ),
              ),
              Container(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: <Widget>[
                    Row(
                      children: <Widget>[
                        RichText(
                          text: TextSpan(
                            text: '3,835',
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 65, color: Colors.black54, letterSpacing: -5),
                            children: <TextSpan>[
                              TextSpan(text: 'kg', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: -3, fontSize: 45, color: Colors.lightBlueAccent), ),
                            ]
                          )

                        )
                      ],
                    ),
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: <Widget>[
                        RichText(
                          textAlign: TextAlign.start,
                          text: TextSpan(
                            text: '20/08/20 10:13',
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.black54),
                          ),
                        ),
                      ],
                    )
                  ],
                ),
              )
            ],
          )
        ],
      ),
    );
  }

  Future scan() async {
    try {
      String barcode = await BarcodeScanner.scan();
      setState(() => this.barcode = barcode);
    } on PlatformException catch (e) {
      if (e.code == BarcodeScanner.CameraAccessDenied) {
        setState(() {
          this.barcode = 'The user did not grant the camera permission!';
        });
      } else {
        setState(() => this.barcode = 'Unknown error: $e');
      }
    } on FormatException{
      setState(() => this.barcode = 'null (User returned using the "back"-button before scanning anything. Result)');
    } catch (e) {
      setState(() => this.barcode = 'Unknown error: $e');
    }
  }
}