//
//  MSDSpaceCat.h
//  Space Cat
//
//  Created by Matthew Dobson on 7/20/14.
//  Copyright (c) 2014 Matthew Dobson. All rights reserved.
//

#import <SpriteKit/SpriteKit.h>

@interface MSDSpaceCatNode : SKSpriteNode

+(instancetype) spaceCatAtPosition:(CGPoint) position;

-(void) performTap;

@end
