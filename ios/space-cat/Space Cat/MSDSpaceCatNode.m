//
//  MSDSpaceCat.m
//  Space Cat
//
//  Created by Matthew Dobson on 7/20/14.
//  Copyright (c) 2014 Matthew Dobson. All rights reserved.
//

#import "MSDSpaceCatNode.h"

@interface MSDSpaceCatNode()
@property (nonatomic) SKAction *tapAction;
@end

@implementation MSDSpaceCatNode

+(instancetype) spaceCatAtPosition:(CGPoint) position {
    MSDSpaceCatNode *spaceCat = [self spriteNodeWithImageNamed:@"spacecat_1"];
    spaceCat.position = position;
    spaceCat.zPosition = 9;
    spaceCat.anchorPoint = CGPointMake(0.5, 0);
    spaceCat.name = @"SpaceCat";
    return spaceCat;
}

- (void) performTap {
    [self runAction:self.tapAction];
}

- (SKAction *) tapAction {
    if ( _tapAction != nil) {
        return _tapAction;
    }
    
    NSArray *textures = @[[SKTexture textureWithImageNamed:@"spacecat_2"], [SKTexture textureWithImageNamed:@"spacecat_1"]];

    _tapAction = [SKAction animateWithTextures:textures timePerFrame:0.25];
    
    return _tapAction;
}

@end
