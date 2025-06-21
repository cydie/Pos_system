package com.example.posapp.ui

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController

@Composable
fun BranchSelectionScreen(navController: NavController) {
    val branches = listOf("Main Branch", "Branch A", "Branch B")

    Column(modifier = Modifier.padding(16.dp)) {
        Text("Select Branch", style = MaterialTheme.typography.headlineSmall)
        Spacer(modifier = Modifier.height(16.dp))

        branches.forEach { branch ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable {
                        navController.navigate("sales")
                    }
                    .padding(8.dp)
            ) {
                Text(branch)
            }
        }
    }
}