//
//  MSDGameOverNode.m
//  Space Cat
//
//  Created by Matthew Dobson on 7/22/14.
//  Copyright (c) 2014 Matthew Dobson. All rights reserved.
//

#import "MSDGameOverNode.h"

@implementation MSDGameOverNode

+ (instancetype) gameOverAtPosition:(CGPoint)position {
    MSDGameOverNode *gameOver = [self node];
    
    SKLabelNode *gameOverLabel = [SKLabelNode labelNodeWithFontNamed:@"Futura-CondensedExtraBold"];
    gameOverLabel.name = @"GameOver";
    gameOverLabel.text = @"Game Over";
    gameOverLabel.fontSize = 48;
    gameOverLabel.position = position;
    [gameOver addChild:gameOverLabel];
    return gameOver;
}

- (void) performAnimation {
    SKLabelNode *label = (SKLabelNode*)[self childNodeWithName:@"GameOver"];
    label.xScale = 0;
    label.yScale = 0;
    SKAction *scaleUp = [SKAction scaleTo:1.2f duration:0.75];
    SKAction *scaleDown = [SKAction scaleTo:0.9f duration:0.25];
    SKAction *run = [SKAction runBlock:^{
        SKLabelNode *touchToRestart = [SKLabelNode labelNodeWithFontNamed:@"Futura-CondensedExtraBold"];
        touchToRestart.text = @"Touch To Restart";
        touchToRestart.fontSize = 24;
        touchToRestart.position = CGPointMake(label.position.x, label.position.y - 40);
        [self addChild:touchToRestart];
    }];
    
    
    SKAction *scaleSequence = [SKAction sequence:@[scaleUp, scaleDown, run]];
    [label runAction:scaleSequence];
}

@end
