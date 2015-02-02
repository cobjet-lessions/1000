//
//  MSDGameplayScene.m
//  Space Cat
//
//  Created by Matthew Dobson on 7/20/14.
//  Copyright (c) 2014 Matthew Dobson. All rights reserved.
//

#import "MSDGameplayScene.h"
#import "MSDMachineNode.h"
#import "MSDSpaceCatNode.h"
#import "MSDProjectileNode.h"
#import "MSDSpaceDogNode.h"
#import "MSDGroundNode.h"
#import "MSDUtil.h"
#import <AVFoundation/AVFoundation.h>
#import "MSDHudNode.h"
#import "MSDGameOverNode.h"

@interface MSDGameplayScene()

@property (nonatomic) NSTimeInterval lastUpdateTimeInterval;
@property (nonatomic) NSTimeInterval timeSinceEnemyAdded;
@property (nonatomic) NSTimeInterval totalGameTime;
@property (nonatomic) NSInteger minSpeed;
@property (nonatomic) NSTimeInterval addEnemyTimeInterval;

@property (nonatomic) SKAction *damageSFX;
@property (nonatomic) SKAction *explodeSFX;
@property (nonatomic) SKAction *laserSFX;

@property (nonatomic) AVAudioPlayer *backgroundMusic;
@property (nonatomic) AVAudioPlayer *gameOverMusic;

@property (nonatomic) BOOL gameover;
@property (nonatomic) BOOL restart;
@property (nonatomic) BOOL gameOverDisplayed;
@end

@implementation MSDGameplayScene

-(id)initWithSize:(CGSize)size {
    if (self = [super initWithSize:size]) {
        
        self.lastUpdateTimeInterval = 0;
        self.timeSinceEnemyAdded = 0;
        
        self.addEnemyTimeInterval = 1.25;
        self.totalGameTime = 0;
        self.minSpeed = MSDSpaceDogMinSpeed;
        
        self.restart = NO;
        self.gameover = NO;
        self.gameOverDisplayed = NO;
        
        SKSpriteNode *background = [SKSpriteNode spriteNodeWithImageNamed:@"background_1"];
        background.position = CGPointMake(CGRectGetMidX(self.frame), CGRectGetMidY(self.frame));
        [self addChild:background];
        MSDMachineNode *machine = [MSDMachineNode machineAtPosition:CGPointMake(CGRectGetMidX(self.frame), 12)];
        [self addChild:machine];
        
        MSDSpaceCatNode *spaceCat = [MSDSpaceCatNode spaceCatAtPosition:CGPointMake(machine.position.x, machine.position.y - 2)];
        [self addChild:spaceCat];
        
        [self addSpaceDog];
        
        self.physicsWorld.gravity = CGVectorMake(0, -9.8);
        self.physicsWorld.contactDelegate = self;
        
        MSDGroundNode *ground = [MSDGroundNode groundWithSize:CGSizeMake(self.frame.size.width, 22)];
        [self addChild:ground];
        
        [self setupSounds];
        
        MSDHudNode *hud = [MSDHudNode hudAtPosition:CGPointMake(0, self.frame.size.height - 20) inFrame:self.frame];
        [self addChild:hud];
    }
    
    return self;
}

- (void) didMoveToView:(SKView *)view {
    [self.backgroundMusic play];
}

- (void) setupSounds {
    
    NSURL *url = [[NSBundle mainBundle] URLForResource:@"Gameplay" withExtension:@"mp3"];
    
    self.backgroundMusic = [[AVAudioPlayer alloc] initWithContentsOfURL:url error:nil];
    self.backgroundMusic.numberOfLoops = -1;
    [self.backgroundMusic prepareToPlay];
    
    
    NSURL *gameOverUrl = [[NSBundle mainBundle] URLForResource:@"Gameplay" withExtension:@"mp3"];
    
    self.gameOverMusic = [[AVAudioPlayer alloc] initWithContentsOfURL:gameOverUrl error:nil];
    self.gameOverMusic.numberOfLoops = -1;
    [self.gameOverMusic prepareToPlay];
    
    self.damageSFX = [SKAction playSoundFileNamed:@"Damage.caf" waitForCompletion:NO];
    self.explodeSFX = [SKAction playSoundFileNamed:@"Explode.caf" waitForCompletion:NO];
    self.laserSFX = [SKAction playSoundFileNamed:@"Laser.caf" waitForCompletion:NO];
}

- (void) touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event {
    if (!self.gameover) {
        for (UITouch *touch in touches) {
            CGPoint position = [touch locationInNode:self];
            [self shootProjectileTowardsPosition:position];
        }
    } else if(self.restart){
        
        for (SKNode *node in [self children]) {
            [node removeFromParent];
        }
        
        MSDGameplayScene *scene = [MSDGameplayScene sceneWithSize:self.view.bounds.size];
        [self.view presentScene:scene];
    }
}

- (void) performGameOver {
    MSDGameOverNode *gameOver = [MSDGameOverNode gameOverAtPosition:CGPointMake(CGRectGetMidX(self.frame), CGRectGetMidY(self.frame))];
    [self addChild:gameOver];
    [gameOver performAnimation];
    self.restart = YES;
    self.gameOverDisplayed = YES;
    [self.backgroundMusic stop];
    [self.gameOverMusic play];
}

- (void) shootProjectileTowardsPosition:(CGPoint)position {
    MSDSpaceCatNode *spaceCat = (MSDSpaceCatNode *)[self childNodeWithName:@"SpaceCat"];
    
    [spaceCat performTap];
    
    MSDMachineNode *machine = (MSDMachineNode *)[self childNodeWithName:@"Machine"];
    
    
    MSDProjectileNode *projectile = [MSDProjectileNode projectileAtPosition:CGPointMake(machine.position.x, machine.position.y + machine.frame.size.height - 15)];
    [self addChild:projectile];
    [projectile moveTowardsPosition:position];
    [self runAction:self.laserSFX];
}

-(void) addSpaceDog {
    NSUInteger randomSpaceDog = [MSDUtil randomWithMin:0 max:2];
    MSDSpaceDogNode *spaceDog = [MSDSpaceDogNode spaceDogOfType:randomSpaceDog];
    float dy = [MSDUtil randomWithMin:MSDSpaceDogMinSpeed max:MSDSpaceDogMaxSpeed];
    spaceDog.physicsBody.velocity = CGVectorMake(0, dy);
    float y = self.frame.size.height + spaceDog.size.height;
    float x = [MSDUtil randomWithMin:10+spaceDog.size.width max:self.frame.size.width - spaceDog.size.width - 10];
    spaceDog.position = CGPointMake(x, y);
    [self addChild:spaceDog];
}

- (void) update:(NSTimeInterval)currentTime {
    if (self.lastUpdateTimeInterval) {
        self.timeSinceEnemyAdded += currentTime - self.lastUpdateTimeInterval;
        self.totalGameTime += currentTime - self.lastUpdateTimeInterval;
    }
    
    if (self.timeSinceEnemyAdded > self.addEnemyTimeInterval && !self.gameover) {
        [self addSpaceDog];
        self.timeSinceEnemyAdded = 0;
    }
    self.lastUpdateTimeInterval = currentTime;
    
    if (self.totalGameTime > 480) {
        self.addEnemyTimeInterval = 0.50;
        self.minSpeed = -160;
    } else if (self.totalGameTime > 240) {
        self.addEnemyTimeInterval = 0.65;
        self.minSpeed = -150;
    } else if (self.totalGameTime > 120) {
        self.addEnemyTimeInterval = 0.75;
        self.minSpeed = -125;
    } else if (self.totalGameTime > 60) {
        self.addEnemyTimeInterval = 1.0;
        self.minSpeed = -100;
    }
    
    if(self.gameover && !self.gameOverDisplayed) {
        [self performGameOver];
    }
}

- (void) addPoints:(NSInteger)points {
    MSDHudNode *hud = (MSDHudNode *)[self childNodeWithName:@"HUD"];
    [hud addPoints:points];
}

- (void) loseLife {
    MSDHudNode *hud = (MSDHudNode *)[self childNodeWithName:@"HUD"];
    self.gameover = [hud loseLife];
}



- (void)didBeginContact:(SKPhysicsContact *)contact {
    
    SKPhysicsBody *firstBody, *secondBody;
    
    if (contact.bodyA.categoryBitMask < contact.bodyB.categoryBitMask) {
        firstBody = contact.bodyA;
        secondBody = contact.bodyB;
    } else {
        firstBody = contact.bodyB;
        secondBody = contact.bodyA;
    }
    
    if (firstBody.categoryBitMask == MSDCollisionCategoryEnemy && secondBody.categoryBitMask == MSDCollisionCategoryProjectile) {
        NSLog(@"BAM!");
        
        [self addPoints:MSDPointsPerHit];
        
        MSDSpaceDogNode *spaceDog = (MSDSpaceDogNode *)firstBody.node;
        MSDProjectileNode *projectile = (MSDProjectileNode *)secondBody.node;
        if (!spaceDog.damaged) {
            spaceDog.damaged = YES;
            [spaceDog removeActionForKey:@"animation1"];
            SKTexture *setBroken;
            if (spaceDog.type == MSDSpaceDogTypeA) {
                setBroken = [SKTexture textureWithImageNamed:@"spacedog_A_3"];
            } else {
                setBroken = [SKTexture textureWithImageNamed:@"spacedog_B_3"];
            }
            [spaceDog runAction:[SKAction setTexture:setBroken]];
        } else {
            [self createDebrisAtPosition:contact.contactPoint];
            [spaceDog removeFromParent];
        }
        [projectile removeFromParent];
        [self runAction:self.explodeSFX];
        
    } else if ( firstBody.categoryBitMask == MSDCollisionCategoryEnemy && secondBody.categoryBitMask == MSDCollisionCategoryGround) {
        NSLog(@"Hit ground!");
        MSDSpaceDogNode *spaceDog = (MSDSpaceDogNode *)firstBody.node;
        
        [spaceDog removeFromParent];
        [self loseLife];
        [self createDebrisAtPosition:contact.contactPoint];
        [self runAction:self.damageSFX];
    }
    
}

-(void) createDebrisAtPosition:(CGPoint) position {
    NSInteger numberOfPieces = [MSDUtil randomWithMin:5 max:20];
    
    for (int i = 0; i < numberOfPieces; i++) {
        NSInteger randomPiece = [MSDUtil randomWithMin:1 max:4];
        NSString *imageName = [NSString stringWithFormat:@"debri_%d", randomPiece];
        SKSpriteNode *debris = [SKSpriteNode spriteNodeWithImageNamed:imageName];
        debris.position = position;
        [self addChild:debris];
        
        debris.physicsBody = [SKPhysicsBody bodyWithRectangleOfSize:debris.frame.size];
        debris.physicsBody.contactTestBitMask = 0;
        debris.physicsBody.collisionBitMask = MSDCollisionCategoryGround | MSDCollisionCategoryDebris;
        debris.name = @"Debris";
        debris.physicsBody.velocity = CGVectorMake([MSDUtil randomWithMin:-150 max:150], [MSDUtil randomWithMin:150 max:350]);
        
        [debris runAction:[SKAction waitForDuration:2.0] completion:^{
            [debris removeFromParent];
        }];
    }
    
    
    NSString *explosionPath = [[NSBundle mainBundle] pathForResource:@"Explosion" ofType:@"sks"];
    SKEmitterNode *explosion = [NSKeyedUnarchiver unarchiveObjectWithFile:explosionPath];
    explosion.position = position;
    [self addChild:explosion];
    [explosion runAction:[SKAction waitForDuration:2.0] completion:^{
        [explosion removeFromParent];
    }];
}

@end
