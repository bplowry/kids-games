package com.quokka.passtheparcel

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.quokka.passtheparcel.ui.theme.PassTheParcelTheme
import kotlin.random.Random

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            PassTheParcelTheme {
                // A surface container using the 'background' color from the theme
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background,
                ) {
                    PassTheParcelGame()
                }
            }
        }
    }
}

@Composable
fun PassTheParcelGame(modifier: Modifier = Modifier) {
    var passes by rememberSaveable { mutableStateOf(-1) }

    val colors = listOf(
        MaterialTheme.colorScheme.primary,
        MaterialTheme.colorScheme.secondary,
        MaterialTheme.colorScheme.error,
        MaterialTheme.colorScheme.background,
        MaterialTheme.colorScheme.inversePrimary,
        MaterialTheme.colorScheme.inverseSurface,
    )

    var colorIndex = if (passes < 0) 0 else (passes % colors.size)
    val color = colors.get(colorIndex)

    Box(
        contentAlignment = Alignment.Center,
        modifier = modifier.background(color),
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier.fillMaxSize(),
        ) {
            if (passes > 0) {
                Text("Pass it on", fontSize = 36.sp)
                Spacer(Modifier.height(24.dp))
                Button(onClick = { passes-- }) {
                    Text("Next", fontSize = 30.sp)
                }

                Spacer(Modifier.height(96.dp))
                Button(
                    onClick = { passes = -1 }
                ) {
                    Text("Reset")
                }
            } else if (passes == 0) {
                Text("You win!", fontSize = 48.sp)
                Spacer(Modifier.height(48.dp))
                Button(
                    onClick = { passes-- }) {
                    Text("Play again", fontSize = 24.sp)
                }
            } else {
                Button(onClick = { passes = Random.nextInt(4, 10) }) {
                    Text("Start game", fontSize = 36.sp)
                }
            }
        }
    }
}