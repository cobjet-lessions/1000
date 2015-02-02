//
//  MSDMachineNode.m
//  Space Cat
//
//  Created by Matthew Dobson on 7/20/14.
//  Copyright (c) 2014 Matthew Dobson. All rights reserved.
//

#import "MSDMachineNode.h"

@implementation MSDMachineNode

+ (instancetype) machineAtPosition:(CGPoint) position {
    MSDMachineNode *machine = [self spriteNodeWithImageNamed:@"machine_1"];
    machine.position = position;
    machine.zPosition = 8;
    machine.anchorPoint = CGPointMake(0.5, 0);
    machine.name = @"Machine";
    NSArray *textures = @[[SKTexture textureWithImageNamed:@"machine_1"],[SKTexture textureWithImageNamed:@"machine_2"]];
    
    
    SKAction *machineAction = [SKAction animateWithTextures:textures timePerFrame:0.1];
    
    SKAction *machineRepeat = [SKAction repeatActionForever:machineAction];
    [machine runAction:machineRepeat];
    return machine;
    
    
}

@end
