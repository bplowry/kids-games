//
//  ContentView.swift
//  FlipThatCoin
//
//  Created by Ben Lowry on 10/9/2023.
//

import SwiftUI

struct ContentView: View {
    @State var isFlipping = false
    @State var isHeads = false
    @State var degrees: Int = 0
    
    func flipACoin() {
        withAnimation {
            isFlipping.toggle()
            let halfTurns = Int.random(in: 5...6)
            
            // after 1000 turns, reset just to avoid int overflow
            if (degrees > 360000) {
                reset()
            }
            degrees = degrees + (halfTurns * 180)
            isHeads = (degrees / 180) % 2  == 0
            isFlipping.toggle()
        }
    }
    
    func reset() {
        degrees = 0
    }
    
    var body: some View {
        VStack {
            Spacer()
            Coin(isFlipping: $isFlipping, isHeads: $isHeads)
                .rotation3DEffect(Angle(degrees: Double(degrees)), axis: (x: CGFloat(0), y: CGFloat(10), z: CGFloat(0)))
            Spacer()
            Button("Flip That Coin") {
                flipACoin()
            }
            Spacer()
        }
        .padding()
    }
}

struct Coin: View {
    @Binding var isFlipping: Bool
    @Binding var isHeads: Bool
    var body: some View {
        ZStack {
            Circle().foregroundColor(isHeads ? .orange : .indigo).frame(width: 100, height: 100)
            Circle().foregroundColor(isHeads ? .yellow : .blue)
                .frame(width: 90, height: 90)
            Text(isFlipping ? "" : isHeads ? "H" : "T")
                .font(.system(size: CGFloat(50)))
                .frame(width: 100, height: 100)
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
