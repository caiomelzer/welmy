import 'package:flutter/material.dart';
import 'package:welmy/pages/login.dart';
import 'package:http/http.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:welmy/pages/home_page.dart';

void main() {runApp(MyApp());
}

class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState  extends State<MyApp> {
  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle.dark);
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(primaryColor : Colors.blue),
      home: checkUserLoggedIn() == null
          ? HomePage()
          : LoginPage(),
    );
  }
}
Future<bool> checkUserLoggedIn() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  String token = prefs.getString('token');
  print(token);
  return prefs.getBool("token");
}