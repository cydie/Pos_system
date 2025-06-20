package com.example.posapp.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.TextFieldValue
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.posapp.data.local.AppDatabase
import com.example.posapp.model.UserRole
import kotlinx.coroutines.launch

@Composable
fun LoginScreen(navController: NavController) {
    var pin by remember { mutableStateOf(TextFieldValue("")) }
    var loading by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf("") }

    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("Enter 4-digit PIN", style = MaterialTheme.typography.headlineSmall)
        Spacer(modifier = Modifier.height(16.dp))

        TextField(
            value = pin,
            onValueChange = {
                if (it.text.length <= 4 && it.text.matches(Regex("\\d*"))) {
                    pin = it
                }
            },
            label = { Text("PIN") },
            visualTransformation = PasswordVisualTransformation(),
            keyboardOptions = androidx.compose.ui.text.input.KeyboardOptions(keyboardType = androidx.compose.ui.text.input.KeyboardType.NumberPassword)
        )

        if (error.isNotBlank()) {
            Text(text = error, color = MaterialTheme.colorScheme.error)
        }

        Spacer(modifier = Modifier.height(16.dp))
        Button(onClick = {
            if (pin.text.length == 4) {
                loading = true
                error = ""

                coroutineScope.launch {
                    try {
                        val db = AppDatabase.getInstance(context)
                        val user = db.userDao().getUserByPin(pin.text)

                        if (user != null) {
                            when (user.role) {
                                UserRole.ADMIN -> navController.navigate("admin_panel")
                                UserRole.CASHIER -> navController.navigate("cashier_panel")
                            }
                        } else {
                            error = "Invalid PIN"
                        }
                    } catch (e: Exception) {
                        error = "Database error"
                    } finally {
                        loading = false
                    }
                }
            } else {
                error = "PIN must be 4 digits"
            }
        }, enabled = !loading) {
            Text(if (loading) "Logging in..." else "Login")
        }
    }
}