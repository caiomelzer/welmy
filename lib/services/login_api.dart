import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';


class LoginApi{
  static Future<bool> login(String user, String password) async {
    try{
      var url ='http://192.241.216.185:1337/auth/local';
      var header = {"Content-Type" : "application/json"};
      Map params = {
        "identifier" : user,
        "password" : password
      };
      var _body = json.encode(params);
      var response = await http.post(url, headers:header, body: _body);
      Map mapResponse = json.decode(response.body);
      String token = mapResponse["jwt"];
      print(mapResponse);
      SharedPreferences sharedPreferences = await SharedPreferences.getInstance();
      sharedPreferences.setString('token', token);
      return true;
    }on Exception catch (e) {
      print('Exception details:\n $e');
    }
  }
}