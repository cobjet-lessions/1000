//
//  MSDSpaceDogNode.m
//  Space Cat
//
//  Created by Matthew Dobson on 7/21/14.
//  Copyright (c) 2014 Matthew Dobson. All rights reserved.
//

#import "MSDSpaceDogNode.h"
#import "MSDUtil.h"

@interface MSDSpaceDogNode()

@end

@implementation MSDSpaceDogNode

+ (instancetype) spaceDogOfType:(MSDSpaceDogType)type {
    MSDSpaceDogNode *spaceDog;
    
    NSArray *textures;
    
    if (type == MSDSpaceDogTypeA) {
        spaceDog = [self spriteNodeWithImageNamed:@"spacedog_A_1"];
        textures = @[[SKTexture textureWithImageNamed:@"spacedog_A_1"],
                     [SKTexture textureWithImageNamed:@"spacedog_A_2"]];
    } else {
        spaceDog = [self spriteNodeWithImageNamed:@"spacedog_B_1"];
        textures = @[[SKTexture textureWithImageNamed:@"spacedog_B_1"],
                     [SKTexture textureWithImageNamed:@"spacedog_B_2"]];
    }
    
    float scale = [MSDUtil randomWithMin:85 max:100] / 100.0f;
    spaceDog.xScale = scale;
    spaceDog.yScale = scale;
    spaceDog.damaged = NO;
    spaceDog.type = type;
    
    SKAction *animation = [SKAction animateWithTextures:textures timePerFrame:0.1];
    [spaceDog runAction:[SKAction repeatActionForever:animation] withKey:@"animation1"];
    
    [spaceDog setupPhysicsBody];
    
    return spaceDog;
}

-(void) setupPhysicsBody {
    self.physicsBody = [SKPhysicsBody bodyWithRectangleOfSize:self.frame.size];
    self.physicsBody.affectedByGravity = NO;
    self.physicsBody.categoryBitMask = MSDCollisionCategoryEnemy;
    self.physicsBody.collisionBitMask = 0;
    self.physicsBody.contactTestBitMask = MSDCollisionCategoryProjectile | MSDCollisionCategoryGround;
}

@end
