package com.example.posapp.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController

@Composable
fun PinKeypad(navController: NavController) {
    var pin by remember { mutableStateOf("") }

    Column(modifier = Modifier.fillMaxWidth()) {
        Row(Modifier.padding(8.dp), horizontalArrangement = Arrangement.SpaceEvenly) {
            for (i in 1..3) NumberButton(i.toString(), pin, onPinChange = { pin = it })
        }
        Row(Modifier.padding(8.dp), horizontalArrangement = Arrangement.SpaceEvenly) {
            for (i in 4..6) NumberButton(i.toString(), pin, onPinChange = { pin = it })
        }
        Row(Modifier.padding(8.dp), horizontalArrangement = Arrangement.SpaceEvenly) {
            for (i in 7..9) NumberButton(i.toString(), pin, onPinChange = { pin = it })
        }
        Row(Modifier.padding(8.dp), horizontalArrangement = Arrangement.SpaceEvenly) {
            NumberButton("⌫", pin, isErase = true, onPinChange = { pin = it }, navController)
            NumberButton("0", pin, onPinChange = { pin = it })
            NumberButton("✅", pin, onPinChange = {
                if (it.length == 4) navController.navigate("branch_selection")
            })
        }
    }
}

@Composable
fun NumberButton(
    text: String,
    currentPin: String,
    isErase: Boolean = false,
    onPinChange: (String) -> Unit,
    navController: NavController? = null
) {
    Button(
        onClick = {
            if (isErase) {
                onPinChange(currentPin.dropLast(1))
            } else if (text == "✅") {
                if (currentPin.length == 4) {
                    navController?.navigate("branch_selection")
                }
            } else {
                if (currentPin.length < 4) {
                    onPinChange(currentPin + text)
                }
            }
        },
        modifier = Modifier
            .size(80.dp)
            .padding(4.dp)
    ) {
        Text(text = text, fontSize = 20.sp)
    }
}